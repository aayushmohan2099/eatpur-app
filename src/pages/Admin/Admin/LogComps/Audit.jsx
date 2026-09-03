// src\pages\Admin\Admin\LogComps\Audit.jsx
import React, { useState, useEffect } from "react";
import { getApiAuditLogs } from "../../../../api/logistics";
import MagicButton from "../UniComps/MagicButton";
import Badge from "../UniComps/Badge";

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State for Viewing JSON
  const [selectedPayload, setSelectedPayload] = useState(null);

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      // Build query string (Requires backend support for ?page=X)
      // Pass status Filter if selected
      const query = statusFilter
        ? `?status=${statusFilter}&page=${page}`
        : `?page=${page}`;

      const res = await getApiAuditLogs(statusFilter);
      const data = res.data || res.results || res;

      if (Array.isArray(data)) {
        setLogs(data);
        setTotalPages(1);
      } else if (data.results) {
        setLogs(data.results);
        setTotalPages(Math.ceil(data.count / 12)); // Assuming DRF PAGE_SIZE = 12
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage, statusFilter]);

  const getStatusBadge = (code) => {
    if (!code) return <Badge text="Unknown" type="default" />;
    if (code >= 200 && code < 300) return <Badge text={code} type="success" />;
    if (code >= 400 && code < 500) return <Badge text={code} type="warning" />;
    if (code >= 500) return <Badge text={code} type="error" />;
    return <Badge text={code} type="info" />;
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-medium text-slate-800 font-serif">
            API Audit Logs
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Raw request/response logs for Ekart integration debugging.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-600"
        >
          <option value="">All Status Codes</option>
          <option value="200">200 OK</option>
          <option value="400">400 Bad Request</option>
          <option value="401">401 Unauthorized</option>
          <option value="500">500 Server Error</option>
          <option value="502">502 Bad Gateway</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">Timestamp</th>
                <th className="p-4 font-semibold">Method</th>
                <th className="p-4 font-semibold">Endpoint</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Time (ms)</th>
                <th className="p-4 font-semibold text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 whitespace-nowrap text-xs text-slate-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                        {log.method}
                      </span>
                    </td>
                    <td
                      className="p-4 font-mono text-xs truncate max-w-[200px]"
                      title={log.endpoint}
                    >
                      {log.endpoint}
                    </td>
                    <td className="p-4">{getStatusBadge(log.status_code)}</td>
                    <td className="p-4 font-mono">{log.response_time_ms}ms</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedPayload(log)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded transition-colors"
                      >
                        View JSON
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-slate-400 italic"
                  >
                    No logs found for selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-100 shadow-sm mt-4">
          <span className="text-sm text-slate-500">
            Page <span className="font-bold text-slate-800">{currentPage}</span>{" "}
            of {totalPages}
          </span>
          <div className="flex gap-3">
            <MagicButton
              variant="eatpur"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </MagicButton>
            <MagicButton
              variant="eatpur"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </MagicButton>
          </div>
        </div>
      )}

      {/* JSON Viewer Modal */}
      {selectedPayload && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPayload(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800">
                  {selectedPayload.method} {selectedPayload.endpoint}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(selectedPayload.created_at).toLocaleString()} |{" "}
                  {selectedPayload.response_time_ms}ms
                </p>
              </div>
              <button
                onClick={() => setSelectedPayload(null)}
                className="text-slate-400 hover:text-slate-800 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800 text-emerald-400 font-mono text-xs">
              <div className="border border-slate-700 rounded-lg p-3 bg-slate-900 overflow-x-auto">
                <h4 className="text-slate-400 mb-2 border-b border-slate-700 pb-1 uppercase tracking-wider">
                  Request Payload
                </h4>
                <pre>
                  {JSON.stringify(selectedPayload.request_payload, null, 2)}
                </pre>
              </div>
              <div className="border border-slate-700 rounded-lg p-3 bg-slate-900 overflow-x-auto">
                <h4 className="text-slate-400 mb-2 border-b border-slate-700 pb-1 uppercase tracking-wider">
                  Response Payload
                </h4>
                <pre>
                  {JSON.stringify(selectedPayload.response_payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
