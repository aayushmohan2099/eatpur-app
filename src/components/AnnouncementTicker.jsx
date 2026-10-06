import React, { useEffect, useState } from "react";
import { getAnnouncementList } from "../api/shop";

export default function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadAnnouncements = async () => {
      try {
        const response = await getAnnouncementList();
        const records = Array.isArray(response)
          ? response
          : Array.isArray(response?.results)
            ? response.results
            : Array.isArray(response?.data)
              ? response.data
              : [];

        if (isMounted) {
          setAnnouncements(
            records.filter(
              (announcement) =>
                announcement.is_active === true && announcement.message,
            ),
          );
        }
      } catch (error) {
        console.error("Failed to load announcements", error);
      }
    };

    loadAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="w-full overflow-hidden py-2.5" aria-label="Announcements">
      <marquee
        behavior="scroll"
        direction="left"
        scrollamount="6"
        className="text-gray-800 font-serif italic text-[17px] md:text-[20px] font-bold"
      >
        {announcements.map((announcement, index) => (
          <span key={announcement.id || index} className="mx-8 inline-block">
            {announcement.message}
          </span>
        ))}
      </marquee>
    </div>
  );
}
