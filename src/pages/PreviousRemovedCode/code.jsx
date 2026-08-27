    // Homepage
    
    
    {/* Featured Products (Live API Data) */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-eatpur-dark mb-4 tracking-tight">
              Bestsellers
            </h2>
            <p className="text-eatpur-text font-serif italic text-lg md:text-xl opacity-90">
              Crafted from nature's finest grains.
            </p>
          </div>
        </div>

        {/* --- PREMIUM SCROLLING CAROUSEL START --- */}
        <div className="relative w-full max-w-[100vw] overflow-hidden group">
          <div className="absolute top-0 left-0 w-16 md:w-32 h-full  z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-16 md:w-32 h-full  z-10 pointer-events-none"></div>

          {isLoading ? (
            <div className="w-full py-20 text-center text-eatpur-text italic font-serif animate-pulse">
              Loading best sellers...
            </div>
          ) : trendingProducts.length > 0 ? (
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {/* Render the lists twice to create the infinite loop */}
              {[0, 1].map((loopIndex) => (
                <div
                  key={loopIndex}
                  className="flex gap-8 px-4"
                  aria-hidden={loopIndex === 1 ? "true" : "false"}
                >
                  {trendingProducts.map((product) => {
                    const fallbackImage = "/home/prod-carousel/MultiFlour.jpeg";
                    const displayImg =
                      product.media?.[0]?.image ||
                      product.cover_image ||
                      fallbackImage;
                    const healthScore = 90; // Defaulting health score as it's not in the API currently

                    return (
                      <div
                        key={`${loopIndex}-${product.id}`}
                        className="vintage-card w-[280px] md:w-[320px] shrink-0 overflow-hidden flex flex-col group/card relative transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl bg-white"
                      >
                        {/* Top Right Discount Tag */}
                        {product.discounted_price && product.fixed_price && (
                          <div className="absolute top-4 right-4 z-20 bg-[#8B3A2A] text-white font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                            {Math.round(
                              ((product.fixed_price -
                                product.discounted_price) /
                                product.fixed_price) *
                                100,
                            )}
                            % OFF
                          </div>
                        )}

                        <div className="h-64 overflow-hidden p-6 pb-0 flex items-center justify-center bg-gray-50 relative">
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            src={displayImg}
                            alt={product.name}
                            className="h-full object-contain drop-shadow-md rounded-t-xl mix-blend-multiply"
                            loading="lazy"
                          />
                          <button
                            onClick={() =>
                              setQuickViewProduct({
                                ...product,
                                image: displayImg,
                                healthScore,
                              })
                            }
                            className="absolute inset-0 bg-eatpur-white-warm/80 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity backdrop-blur-sm"
                          >
                            <span className="flex items-center gap-2 border border-eatpur-dark text-eatpur-dark px-6 py-3 rounded-full font-display hover:bg-eatpur-dark hover:text-white transition-colors">
                              <FaEye /> Quick View
                            </span>
                          </button>
                        </div>

                        <div className="p-6 flex flex-col flex-1 border-t border-black/5">
                          <span className="text-eatpur-green-dark text-[11px] uppercase tracking-widest font-semibold mb-1 truncate">
                            {product.categoryName}
                          </span>
                          <h3 className="text-xl font-display font-medium text-eatpur-dark mb-1 truncate">
                            {product.name}
                          </h3>

                          {/* Eatpur Health Score Meter */}
                          <div className="mt-3 mb-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner flex items-center relative">
                            <div
                              className="h-full bg-eatpur-green-dark"
                              style={{ width: `${healthScore}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-eatpur-text flex justify-between mb-2">
                            <span className="font-medium text-eatpur-green-dark">
                              Health Score
                            </span>
                            <span className="font-bold">{healthScore}/100</span>
                          </div>

                          <div className="mt-auto flex items-end justify-between pt-4">
                            <div className="flex flex-col">
                              {product.discounted_price ? (
                                <>
                                  <div className="flex items-start gap-1.5 mb-0.5">
                                    <span className="relative text-sm font-sans text-eatpur-text/60">
                                      ₹{product.fixed_price}
                                      <span className="absolute top-1/2 left-[-10%] w-[120%] h-[1.5px] bg-[#8B3A2A] -rotate-[15deg] origin-center"></span>
                                    </span>
                                  </div>
                                  <span className="text-xl font-bold text-[#3A5A1C]">
                                    ₹{product.discounted_price}
                                  </span>
                                </>
                              ) : (
                                <span className="text-xl font-bold text-[#3A5A1C]">
                                  ₹{product.fixed_price}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() =>
                                dispatch({
                                  type: "ADD_ITEM",
                                  payload: {
                                    ...product,
                                    image: displayImg,
                                    price:
                                      product.discounted_price ||
                                      product.fixed_price,
                                  },
                                })
                              }
                              className="w-10 h-10 rounded-full border border-eatpur-dark/20 flex items-center justify-center text-eatpur-dark hover:bg-eatpur-green-dark hover:border-eatpur-green-dark hover:text-white transition-all transform hover:scale-105"
                              aria-label="Add to cart"
                            >
                              <FaCartShopping size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center text-eatpur-text italic font-serif">
              Check back soon for new arrivals!
            </div>
          )}
        </div>
        {/* --- PREMIUM SCROLLING CAROUSEL END --- */}

        <div className="mt-12 text-center">
          <Link to="/products" className="btn-ghost shadow-sm">
            View All Products
          </Link>
        </div>
      </section>



// ProductPage.jsx

 {/* =========================================================================== */}
      {/* QUICK VIEW MODAL */}
      {/* =========================================================================== */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 pt-24 md:pt-4 bg-eatpur-dark/70 backdrop-blur-md overflow-y-auto"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row rounded-3xl shadow-2xl border border-eatpur-gray-light"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-50 text-eatpur-text hover:text-eatpur-dark p-2.5 bg-white/90 rounded-full shadow-lg transition-transform hover:scale-110 border border-slate-100"
              >
                <FaXmark size={20} />
              </button>

              {/* Left Side: Images */}
              <div className="md:w-1/2 p-6 md:p-10 bg-eatpur-green-dark flex flex-col">
                <div className="flex-1 min-h-[300px] md:min-h-[400px] relative rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100">
                  <ImageCarousel
                    images={quickViewProduct.cover_image}
                    alt={quickViewProduct.name}
                    onClickView={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Visual Thumbnail Strip */}
                {Array.isArray(quickViewProduct.cover_image) &&
                  quickViewProduct.cover_image.length > 1 && (
                    <div className="flex gap-3 mt-6 overflow-x-auto hide-scrollbar pb-2">
                      {quickViewProduct.cover_image.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-16 h-16 shrink-0 rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
                        >
                          <img
                            src={img}
                            alt="thumbnail"
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Right Side: Details */}
              <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white relative">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-eatpur-green-dark font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-eatpur-green-light/20 rounded">
                    {quickViewProduct.category_name}
                  </span>
                  <span className="text-eatpur-text font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-slate-100 rounded">
                    {quickViewProduct.size_name} ({quickViewProduct.weight}
                    {quickViewProduct.unit})
                  </span>
                  {quickViewProduct.is_trending && (
                    <span className="text-eatpur-gold-dark font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-eatpur-gold-light/20 rounded">
                      Trending
                    </span>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-serif text-eatpur-dark font-bold mb-2 leading-tight">
                  {quickViewProduct.name}
                </h2>
                <p className="text-xs font-mono text-eatpur-text-light mb-6">
                  PID: {quickViewProduct.pid}
                </p>

                <div className="flex items-baseline gap-4 mb-8 border-b border-eatpur-gray-light pb-6">
                  <span className="text-5xl font-bold text-eatpur-dark tracking-tight">
                    ₹{quickViewProduct.discounted_price}
                  </span>
                  {Number(quickViewProduct.fixed_price) >
                    Number(quickViewProduct.discounted_price) && (
                    <div className="flex flex-col items-start">
                      <span className="relative text-xl font-sans text-eatpur-text-light font-medium">
                        ₹{quickViewProduct.fixed_price}
                        <span className="absolute top-1/2 left-[-5%] w-[110%] h-[2px] bg-rose-500/80 -rotate-[12deg]"></span>
                      </span>
                      <span className="text-rose-600 font-bold text-xs uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded mt-1">
                        Save {quickViewProduct.discount_percentage}%
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-eatpur-text font-sans leading-relaxed mb-8 text-sm md:text-base">
                  {quickViewProduct.description ||
                    "A pure, healthy product crafted for your wellbeing. Perfect for a balanced, modern lifestyle."}
                </p>

                {/* Macro Nutrients Grid */}
                <div
                  className="
                    flex md:grid
                    grid-cols-4
                    gap-3
                    mb-8

                    overflow-x-auto
                    md:overflow-visible
                    pb-2
                    md:pb-0
                    hide-scrollbar
                    snap-x
                    snap-mandatory
                  "
                >
                  {/* Protein */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Protein
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.protein || 0}g
                    </div>
                  </div>

                  {/* Carbs */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Carbs
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.carbohydrates || 0}g
                    </div>
                  </div>

                  {/* Fibre */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Fibre
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.fibre || 0}g
                    </div>
                  </div>

                  {/* Calories */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Calories
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.calories || 0}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <CartButton
                    onClick={() => {
                      dispatch({
                        type: "ADD_ITEM",
                        payload: quickViewProduct,
                      });
                    }}
                    onAnimationComplete={() => {
                      setQuickViewProduct(null);

                      // Open cart AFTER button animation
                      dispatch({
                        type: "OPEN_CART",
                      });
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



 {/* Right Side: Details */}
              
              <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white relative">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-eatpur-green-dark font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-eatpur-green-light/20 rounded">
                    {quickViewProduct.category_name}
                  </span>
                  <span className="text-eatpur-text font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-slate-100 rounded">
                    {quickViewProduct.size_name} ({quickViewProduct.weight}
                    {quickViewProduct.unit})
                  </span>
                  {quickViewProduct.is_trending && (
                    <span className="text-eatpur-gold-dark font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-eatpur-gold-light/20 rounded">
                      Trending
                    </span>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-serif text-eatpur-dark font-bold mb-2 leading-tight">
                  {quickViewProduct.name}
                </h2>
                <p className="text-xs font-mono text-eatpur-text-light mb-6">
                  PID: {quickViewProduct.pid}
                </p>

                <div className="flex items-baseline gap-4 mb-8 border-b border-eatpur-gray-light pb-6">
                  <span className="text-5xl font-bold text-eatpur-dark tracking-tight">
                    ₹{quickViewProduct.discounted_price}
                  </span>
                  {Number(quickViewProduct.fixed_price) >
                    Number(quickViewProduct.discounted_price) && (
                    <div className="flex flex-col items-start">
                      <span className="relative text-xl font-sans text-eatpur-text-light font-medium">
                        ₹{quickViewProduct.fixed_price}
                        <span className="absolute top-1/2 left-[-5%] w-[110%] h-[2px] bg-rose-500/80 -rotate-[12deg]"></span>
                      </span>
                      <span className="text-rose-600 font-bold text-xs uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded mt-1">
                        Save {quickViewProduct.discount_percentage}%
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-eatpur-text font-sans leading-relaxed mb-8 text-sm md:text-base">
                  {quickViewProduct.description ||
                    "A pure, healthy product crafted for your wellbeing. Perfect for a balanced, modern lifestyle."}
                </p>

                {/* Macro Nutrients Grid */}
                <div
                  className="
                    flex md:grid
                    grid-cols-4
                    gap-3
                    mb-8

                    overflow-x-auto
                    md:overflow-visible
                    pb-2
                    md:pb-0
                    hide-scrollbar
                    snap-x
                    snap-mandatory
                  "
                >
                  {/* Protein */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Protein
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.protein || 0}g
                    </div>
                  </div>

                  {/* Carbs */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Carbs
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.carbohydrates || 0}g
                    </div>
                  </div>

                  {/* Fibre */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Fibre
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.fibre || 0}g
                    </div>
                  </div>

                  {/* Calories */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Calories
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.calories || 0}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <CartButton
                    onClick={() => {
                      dispatch({
                        type: "ADD_ITEM",
                        payload: quickViewProduct,
                      });
                    }}
                    onAnimationComplete={() => {
                      setQuickViewProduct(null);

                      // Open cart AFTER button animation
                      dispatch({
                        type: "OPEN_CART",
                      });
                    }}
                  />
                </div>
              </div>