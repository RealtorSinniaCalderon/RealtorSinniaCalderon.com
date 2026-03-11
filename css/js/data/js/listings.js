const fmtMoney = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

async function getListings(){
  const res = await fetch("data/listings.json");
  return res.json();
}

function qs(name){
  return new URLSearchParams(location.search).get(name);
}

/* LISTINGS PAGE */
function renderListings(list){
  const grid = document.getElementById("listingsGrid");
  const empty = document.getElementById("emptyState");
  grid.innerHTML = "";

  if(!list.length){
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  list.forEach(item => {
    const el = document.createElement("article");
    el.className = "listing";
    el.innerHTML = `
      ${item.image}
      <div class="listingBody">
        <div class="price">${fmtMoney(item.price)}</div>
        <div class="address">${item.address}</div>
        <div class="meta">
          <span>${item.beds} bd</span>
          <span>${item.baths} ba</span>
          <span>${item.sqft.toLocaleString()} sqft</span>
          <span>${item.status}</span>
        </div>
        <p class="small" style="margin-top:10px;">${item.description}</p>
        <div class="ctaRow">
          listing.html?id=${encodeURIComponent(item.id)}View Details</a>
          appointments.htmlSchedule Tour</a>
        </div>
      </div>
    `;
    grid.appendChild(el);
  });
}

function applyFilters(all){
  const q = (document.getElementById("q").value || "").trim().toLowerCase();
  const city = (document.getElementById("city").value || "").trim().toLowerCase();
  const minP = Number(document.getElementById("minPrice").value || 0);
  const maxP = Number(document.getElementById("maxPrice").value || 999999999);
  const beds = Number(document.getElementById("beds").value || 0);

  const filtered = all.filter(x => {
    const matchQ = !q || (x.title + " " + x.address).toLowerCase().includes(q);
    const matchCity = !city || (x.city || "").toLowerCase().includes(city);
    const matchP = x.price >= minP && x.price <= maxP;
    const matchBeds = !beds || x.beds >= beds;
    return matchQ && matchCity && matchP && matchBeds;
  });

  renderListings(filtered);
}

/* LISTING DETAIL PAGE */
function renderListingDetail(item){
  const wrap = document.getElementById("listingDetail");
  if(!item){
    wrap.innerHTML = `<div class="notice"><strong>Not found.</strong> That listing ID doesn’t exist.</div>`;
    return;
  }

  const feats = (item.features || []).map(f => `<span class="badge">${f}</span>`).join(" ");
  wrap.innerHTML = `
    <div class="card" style="padding:0; overflow:hidden;">
      ${item.image}
      <div style="padding:16px;">
        <div class="price">${fmtMoney(item.price)}</div>
        <div class="address">${item.address}</div>
        <div class="meta" style="margin-top:10px;">
          <span>${item.beds} bd</span>
          <span>${item.baths} ba</span>
          <span>${item.sqft.toLocaleString()} sqft</span>
          <span>${item.status}</span>
        </div>

        <p class="small" style="margin-top:12px;">${item.description}</p>

        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:12px;">
          ${feats}
        </div>

        <div class="ctaRow" style="margin-top:14px;">
          appointments.htmlSchedule a Tour</a>
          contact.htmlRequest Info</a>
          listings.htmlBack to Listings</a>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  // Listings page
  if(document.getElementById("listingsGrid")){
    const all = await getListings();
    renderListings(all);

    ["q","city","minPrice","maxPrice","beds"].forEach(id => {
      document.getElementById(id).addEventListener("input", () => applyFilters(all));
      document.getElementById(id).addEventListener("change", () => applyFilters(all));
    });
  }

  // Listing detail page
  if(document.getElementById("listingDetail")){
    const id = qs("id");
    const all = await getListings();
    const item = all.find(x => x.id === id);
    renderListingDetail(item);
  }
});
