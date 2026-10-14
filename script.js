const $ = (id) => document.getElementById(id);

let routers = ["A", "B", "C", "D"];
let links = [
  { a: "A", b: "B", cost: 2 },
  { a: "A", b: "C", cost: 7 },
  { a: "B", b: "C", cost: 3 },
  { a: "B", b: "D", cost: 5 },
  { a: "C", b: "D", cost: 1 }
];
let latestTables = null;
let latestLogs = [];

function showMessage(text, type = "") {
  $("message").textContent = text;
  $("message").className = `message ${type}`;
}

function safeName(name) {
  return String(name).trim();
}

function renderRouterNames() {
  $("routerNames").innerHTML = routers.map((name, i) => `
    <div class="router-name-item">
      <label for="routerName${i}">Router ${i + 1}</label>
      <input id="routerName${i}" maxlength="16" value="${escapeHtml(name)}" data-router-index="${i}" />
    </div>`).join("");
  $("routerNames").querySelectorAll("input").forEach(input => {
    input.addEventListener("change", () => {
      const oldName = routers[Number(input.dataset.routerIndex)];
      const newName = safeName(input.value);
      if (!newName) {
        input.value = oldName;
        showMessage("Router names cannot be empty.");
        return;
      }
      if (routers.some((name, i) => i !== Number(input.dataset.routerIndex) && name.toLowerCase() === newName.toLowerCase())) {
        input.value = oldName;
        showMessage("Each router must have a unique name.");
        return;
      }
      routers[Number(input.dataset.routerIndex)] = newName;
      links = links.map(link => ({
        ...link,
        a: link.a === oldName ? newName : link.a,
        b: link.b === oldName ? newName : link.b
      }));
      invalidateResults();
      renderAll();
      showMessage("Router name updated.", "success");
    });
  });
}

function renderRouterSelects() {
  const options = routers.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
  $("fromRouter").innerHTML = options;
  $("toRouter").innerHTML = options;
  $("tableRouter").innerHTML = options;
  $("sourceRouter").innerHTML = options;
  $("destinationRouter").innerHTML = options;
  if (routers.length > 1) {
    $("toRouter").selectedIndex = 1;
    $("destinationRouter").selectedIndex = 1;
  }
}

function renderLinks() {
  const host = $("linksList");
  if (!links.length) {
    host.innerHTML = `<div class="links-empty">No links added yet. Add at least one connection.</div>`;
    return;
  }
  host.innerHTML = links.map((link, i) => `
    <div class="link-row">
      <span class="link-name">${escapeHtml(link.a)} <span style="color:#9aa6b7">↔</span> ${escapeHtml(link.b)}</span>
      <span class="cost-badge">Cost ${link.cost}</span>
      <button class="remove-link" title="Remove connection" aria-label="Remove ${escapeHtml(link.a)} to ${escapeHtml(link.b)}" data-link-index="${i}">×</button>
    </div>`).join("");
  host.querySelectorAll(".remove-link").forEach(button => {
    button.addEventListener("click", () => {
      links.splice(Number(button.dataset.linkIndex), 1);
      invalidateResults();
      renderAll();
      showMessage("Connection removed.", "success");
    });
  });
}

function renderNetwork() {
  const canvas = $("networkCanvas");
  if (!routers.length) {
    canvas.innerHTML = `<div class="empty-state">Create routers and add links to see your network.</div>`;
    return;
  }
  const width = Math.max(canvas.clientWidth || 600, 300);
  const height = 300;
  const cx = width / 2, cy = height / 2;
  const radius = Math.min(width * 0.37, height * 0.36);
  const positions = {};
  routers.forEach((name, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i / routers.length);
    positions[name] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });
  const edgeMarkup = links.map(link => {
    const p1 = positions[link.a], p2 = positions[link.b];
    if (!p1 || !p2) return "";
    const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
    return `<g><line class="edge-line" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"></line>
      <rect class="edge-label-bg" x="${mx - 17}" y="${my - 12}" width="34" height="24" rx="8"></rect>
      <text class="edge-label" x="${mx}" y="${my + 1}">${link.cost}</text></g>`;
  }).join("");
  const nodeMarkup = routers.map(name => {
    const p = positions[name];
    return `<g><circle class="node-circle" cx="${p.x}" cy="${p.y}" r="22"></circle>
      <text class="node-label" x="${p.x}" y="${p.y + 1}">${escapeHtml(shortName(name))}</text></g>`;
  }).join("");
  canvas.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Network diagram">${edgeMarkup}${nodeMarkup}</svg>`;
}

function shortName(name) {
  return name.length > 5 ? name.slice(0, 4) + "…" : name;
}

function renderAll() {
  renderRouterNames();
  renderRouterSelects();
  renderLinks();
  renderNetwork();
  $("summaryRouters").textContent = routers.length;
  $("summaryLinks").textContent = links.length;
  if (!latestTables) $("routingTableWrap").innerHTML = `<div class="empty-state">Run the simulation to calculate routing tables.</div>`;
}

function invalidateResults() {
  latestTables = null;
  latestLogs = [];
  $("routingTableWrap").innerHTML = `<div class="empty-state">Network changed. Run the simulation again to calculate routing tables.</div>`;
  $("iterations").innerHTML = `<div class="empty-state">Run the simulation to see the updated iteration log.</div>`;
  $("bestRouteResult").innerHTML = `<span class="route-result-label">BEST ROUTE</span><p>Run the simulation again, then find a route.</p>`;
  $("iterationBadge").textContent = "NOT RUN YET";
}

function addLink() {
  const a = $("fromRouter").value;
  const b = $("toRouter").value;
  const cost = Number($("linkCost").value);
  if (a === b) return showMessage("Choose two different routers.");
  if (!Number.isInteger(cost) || cost < 1 || cost > 999) return showMessage("Link cost must be a whole number from 1 to 999.");
  const existing = links.find(link => (link.a === a && link.b === b) || (link.a === b && link.b === a));
  if (existing) {
    existing.cost = cost;
    showMessage(`Updated ${a} ↔ ${b} to cost ${cost}.`, "success");
  } else {
    links.push({ a, b, cost });
    showMessage(`Added connection ${a} ↔ ${b}.`, "success");
  }
  invalidateResults();
  renderAll();
}

function createRouters() {
  const count = Number($("routerCount").value);
  if (!Number.isInteger(count) || count < 2 || count > 12) {
    showMessage("Enter a whole number from 2 to 12.");
    return;
  }
  routers = Array.from({ length: count }, (_, i) => i < 4 ? ["A", "B", "C", "D"][i] : `R${i + 1}`);
  links = [];
  latestTables = null;
  invalidateResults();
  renderAll();
  showMessage(`${count} routers created. Rename them and add connections.`, "success");
}

function runSimulation() {
  if (routers.length < 2) return showMessage("Create at least two routers first.");
  if (links.some(l => !routers.includes(l.a) || !routers.includes(l.b))) return showMessage("A connection contains an unknown router. Please check your network.");
  const tables = {};
  routers.forEach(router => {
    tables[router] = {};
    routers.forEach(dest => {
      tables[router][dest] = { cost: router === dest ? 0 : Infinity, nextHop: router === dest ? "—" : "—" };
    });
  });
  links.forEach(({a,b,cost}) => {
    tables[a][b] = { cost, nextHop: b };
    tables[b][a] = { cost, nextHop: a };
  });

  const logs = [{
    title: "Initialization",
    text: "Each router knows the cost to itself (0) and its directly connected neighbors. Other destinations start at infinity (∞)."
  }];
  let changed = true, iteration = 0;
  const maxIterations = routers.length * routers.length + 2;
  while (changed && iteration < maxIterations) {
    changed = false;
    iteration++;
    const snapshot = {};
    routers.forEach(r => {
      snapshot[r] = {};
      routers.forEach(d => snapshot[r][d] = { ...tables[r][d] });
    });
    const updates = [];
    routers.forEach(router => {
      const neighbors = links.filter(l => l.a === router || l.b === router).map(l => ({
        name: l.a === router ? l.b : l.a,
        cost: l.cost
      }));
      neighbors.forEach(neighbor => {
        routers.forEach(destination => {
          const neighborRoute = snapshot[neighbor.name][destination];
          if (neighborRoute.cost === Infinity) return;
          const candidate = neighbor.cost + neighborRoute.cost;
          if (candidate < tables[router][destination].cost) {
            const oldCost = tables[router][destination].cost;
            tables[router][destination] = { cost: candidate, nextHop: neighbor.name };
            changed = true;
            updates.push(`${router} → ${destination}: ${oldCost === Infinity ? "∞" : oldCost} to ${candidate} via ${neighbor.name}`);
          }
        });
      });
    });
    logs.push({
      title: `Iteration ${iteration}`,
      text: updates.length ? `${updates.length} route update${updates.length === 1 ? "" : "s"}: ${updates.join("; ")}.` : "No lower-cost routes found. The routing tables have converged."
    });
  }
  if (changed) logs.push({ title: "Safety limit", text: "The iteration safety limit was reached. Try checking the network for unusual settings." });
  latestTables = tables;
  latestLogs = logs;
  renderRoutingTable();
  renderIterations();
  $("iterationBadge").textContent = `${Math.max(0, logs.length - 1)} ITERATION${logs.length - 1 === 1 ? "" : "S"}`;
  $("bestRouteResult").innerHTML = `<span class="route-result-label">BEST ROUTE</span><p>Choose a source and destination, then click Find best route.</p>`;
  showMessage("Simulation complete. Routing tables have been calculated.", "success");
}

function findBestRoute() {
  if (!latestTables) {
    $("bestRouteResult").innerHTML = `<span class="route-result-label">BEST ROUTE</span><p>Please click <strong>Run simulation</strong> first.</p>`;
    return;
  }
  const source = $("sourceRouter").value;
  const destination = $("destinationRouter").value;
  const result = $("bestRouteResult");
  if (!source || !destination) {
    result.innerHTML = `<span class="route-result-label">BEST ROUTE</span><p>Select both routers.</p>`;
    return;
  }
  if (source === destination) {
    result.innerHTML = `<span class="route-result-label">BEST ROUTE</span><p class="route-path">${escapeHtml(source)}</p><div class="route-cost">Total cost: 0</div><small>Source and destination are the same router.</small>`;
    return;
  }
  const route = latestTables[source][destination];
  if (!route || route.cost === Infinity) {
    result.innerHTML = `<span class="route-result-label">BEST ROUTE</span><p>No route is available from <strong>${escapeHtml(source)}</strong> to <strong>${escapeHtml(destination)}</strong>.</p><div class="route-cost">Total cost: ∞</div><small>These routers are disconnected in the current network.</small>`;
    return;
  }

  const path = [source];
  let current = source;
  const visited = new Set([source]);
  for (let step = 0; step < routers.length && current !== destination; step++) {
    const hop = latestTables[current][destination]?.nextHop;
    if (!hop || hop === "—" || visited.has(hop)) break;
    path.push(hop);
    visited.add(hop);
    current = hop;
  }
  if (current !== destination) {
    result.innerHTML = `<span class="route-result-label">BEST ROUTE</span><p>Could not reconstruct a valid route. Please run the simulation again.</p>`;
    return;
  }
  result.innerHTML = `<span class="route-result-label">BEST ROUTE FROM ${escapeHtml(source)} TO ${escapeHtml(destination)}</span>
    <p class="route-path">${path.map(escapeHtml).join('<span class="route-arrow"> → </span>')}</p>
    <div class="route-cost">Total cost: ${route.cost}</div>
    <small>${path.length - 1} link${path.length - 1 === 1 ? "" : "s"} • Lowest-cost path calculated by Distance Vector Routing</small>`;
}

function renderRoutingTable() {
  const selected = $("tableRouter").value || routers[0];
  if (!latestTables || !latestTables[selected]) return;
  const rows = routers.map(dest => {
    const route = latestTables[selected][dest];
    const cost = route.cost === Infinity ? "∞" : route.cost;
    const nextHop = dest === selected ? "Local" : (route.cost === Infinity ? "—" : route.nextHop);
    return `<tr>
      <td><span class="destination-chip">${escapeHtml(dest)}</span></td>
      <td class="${route.cost === Infinity ? "unreachable" : "cost-cell"}">${cost}</td>
      <td>${escapeHtml(nextHop)}</td>
      <td>${dest === selected ? "Current router" : route.cost === Infinity ? "No available path" : route.nextHop === dest ? "Direct link" : "Via another router"}</td>
    </tr>`;
  }).join("");
  $("routingTableWrap").innerHTML = `<table class="routing-table">
    <thead><tr><th>Destination</th><th>Minimum cost</th><th>Next hop</th><th>Route type</th></tr></thead>
    <tbody>${rows}</tbody></table>`;
}

function renderIterations() {
  $("iterations").innerHTML = latestLogs.map((log, i) => `
    <div class="iteration-card">
      <div class="iteration-title"><span class="iteration-number">${i}</span><span>${escapeHtml(log.title)}</span></div>
      <div class="iteration-body">${escapeHtml(log.text)}</div>
    </div>`).join("");
}

function resetExample() {
  routers = ["A", "B", "C", "D"];
  links = [
    { a: "A", b: "B", cost: 2 },
    { a: "A", b: "C", cost: 7 },
    { a: "B", b: "C", cost: 3 },
    { a: "B", b: "D", cost: 5 },
    { a: "C", b: "D", cost: 1 }
  ];
  $("routerCount").value = 4;
  latestTables = null;
  invalidateResults();
  renderAll();
  showMessage("Example network restored. Click Run simulation to calculate routes.", "success");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

$("createRoutersBtn").addEventListener("click", createRouters);
$("addLinkBtn").addEventListener("click", addLink);
$("runBtn").addEventListener("click", runSimulation);
$("resetBtn").addEventListener("click", resetExample);
$("tableRouter").addEventListener("change", renderRoutingTable);
$("findRouteBtn").addEventListener("click", findBestRoute);
window.addEventListener("resize", renderNetwork);

renderAll();
runSimulation();
