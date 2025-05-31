(() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const tooltip = document.getElementById("tooltip");

  const graphSelect = document.getElementById("graphSelect");
  const graphColorInput = document.getElementById("graphColor");
  const addGraphBtn = document.getElementById("addGraphBtn");
  const clearGraphsBtn = document.getElementById("clearGraphsBtn");
  const graphsListDiv = document.getElementById("graphsList");

  const xMinInput = document.getElementById("xMinInput");
  const xMaxInput = document.getElementById("xMaxInput");
  const stepsInput = document.getElementById("stepsInput");

  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const resetZoomBtn = document.getElementById("resetZoomBtn");

  const legendDiv = document.getElementById("legend");

  const padding = 50;

  let graphs = [];

  // Zoom state
  let zoom = {
    xMin: parseFloat(xMinInput.value),
    xMax: parseFloat(xMaxInput.value),
    yMin: null,
    yMax: null,
  };

  // Predefined graph functions
  const graphFunctions = {
    sin: (x) => Math.sin(x),
    cos: (x) => Math.cos(x),
    square: (x) => x * x,
    linear: (x) => x,
    exp: (x) => Math.exp(x),
  };

  // Add graph to list and UI
  function addGraph(type, color) {
    if (!graphFunctions[type]) return;
    const id = Date.now() + Math.random();
    graphs.push({ id, type, color });
    renderGraphList();
    updatePlot();
  }

  // Remove graph from list and update
  function removeGraph(id) {
    graphs = graphs.filter((g) => g.id !== id);
    renderGraphList();
    updatePlot();
  }

  // Render the list of graphs with color and remove button
  function renderGraphList() {
    graphsListDiv.innerHTML = "";
    graphs.forEach(({ id, type, color }) => {
      const div = document.createElement("div");

      const label = document.createElement("label");
      label.style.color = color;
      label.textContent = `${type}()`;

      const colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.value = color;
      colorInput.title = "Change color";
      colorInput.style.cursor = "pointer";
      colorInput.addEventListener("input", (e) => {
        const idx = graphs.findIndex((g) => g.id === id);
        if (idx !== -1) {
          graphs[idx].color = e.target.value;
          renderLegend();
          updatePlot();
        }
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.style.backgroundColor = "#d9534f";
      removeBtn.style.marginLeft = "auto";
      removeBtn.addEventListener("click", () => removeGraph(id));

      div.appendChild(label);
      div.appendChild(colorInput);
      div.appendChild(removeBtn);
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.gap = "10px";

      graphsListDiv.appendChild(div);
    });

    renderLegend();
  }

  // Calculate y range for all graphs combined
  function calcYRange(xMin, xMax, steps) {
    let yMin = Infinity;
    let yMax = -Infinity;
    graphs.forEach(({ type }) => {
      const fn = graphFunctions[type];
      for (let i = 0; i <= steps; i++) {
        const x = xMin + (i / steps) * (xMax - xMin);
        const y = fn(x);
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
      }
    });
    if (yMin === Infinity || yMax === -Infinity) {
      yMin = -1;
      yMax = 1;
    }
    const margin = (yMax - yMin) * 0.1 || 1;
    return [yMin - margin, yMax + margin];
  }

  // Map data coordinates to canvas coordinates
  function mapX(x, xMin, xMax) {
    return (
      padding + ((x - xMin) / (xMax - xMin)) * (canvas.width - 2 * padding)
    );
  }
  function mapY(y, yMin, yMax) {
    return (
      canvas.height -
      padding -
      ((y - yMin) / (yMax - yMin)) * (canvas.height - 2 * padding)
    );
  }

  // Draw axes and grid
  function drawAxes(xMin, xMax, yMin, yMax) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;

    // Draw grid lines X axis
    const xGridCount = 10;
    for (let i = 0; i <= xGridCount; i++) {
      const x = padding + (i * (canvas.width - 2 * padding)) / xGridCount;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }
    // Draw grid lines Y axis
    const yGridCount = 10;
    for (let i = 0; i <= yGridCount; i++) {
      const y = padding + (i * (canvas.height - 2 * padding)) / yGridCount;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw axes lines
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    // X axis line
    const zeroY =
      yMin > 0
        ? mapY(yMin, yMin, yMax)
        : yMax < 0
        ? mapY(yMax, yMin, yMax)
        : mapY(0, yMin, yMax);
    ctx.beginPath();
    ctx.moveTo(padding, zeroY);
    ctx.lineTo(canvas.width - padding, zeroY);
    ctx.stroke();

    // Y axis line
    const zeroX =
      xMin > 0
        ? mapX(xMin, xMin, xMax)
        : xMax < 0
        ? mapX(xMax, xMin, xMax)
        : mapX(0, xMin, xMax);
    ctx.beginPath();
    ctx.moveTo(zeroX, padding);
    ctx.lineTo(zeroX, canvas.height - padding);
    ctx.stroke();

    // Draw tick labels for X axis
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (let i = 0; i <= xGridCount; i++) {
      const xVal = xMin + (i / xGridCount) * (xMax - xMin);
      const x = padding + (i * (canvas.width - 2 * padding)) / xGridCount;
      ctx.fillText(xVal.toFixed(2), x, zeroY + 5);
    }

    // Draw tick labels for Y axis
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= yGridCount; i++) {
      const yVal = yMax - (i / yGridCount) * (yMax - yMin);
      const y = padding + (i * (canvas.height - 2 * padding)) / yGridCount;
      ctx.fillText(yVal.toFixed(2), zeroX - 5, y);
    }
  }

  // Draw all graphs
  function drawGraphs(xMin, xMax, yMin, yMax, steps) {
    graphs.forEach(({ type, color }) => {
      const fn = graphFunctions[type];
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const x = xMin + (i / steps) * (xMax - xMin);
        const y = fn(x);
        const px = mapX(x, xMin, xMax);
        const py = mapY(y, yMin, yMax);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
  }

  // Render legend
  function renderLegend() {
    legendDiv.innerHTML = "";
    graphs.forEach(({ type, color }) => {
      const item = document.createElement("div");
      item.className = "legend-item";
      const colorBox = document.createElement("div");
      colorBox.className = "color-box";
      colorBox.style.backgroundColor = color;
      item.appendChild(colorBox);
      item.appendChild(document.createTextNode(type + "()"));
      legendDiv.appendChild(item);
    });
  }

  // Update plot based on current state and inputs
  function updatePlot() {
    if (graphs.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      legendDiv.innerHTML = "";
      return;
    }
    const xMin = zoom.xMin;
    const xMax = zoom.xMax;
    const steps = parseInt(stepsInput.value, 10);

    const [yMin, yMax] = calcYRange(xMin, xMax, steps);
    zoom.yMin = yMin;
    zoom.yMax = yMax;

    drawAxes(xMin, xMax, yMin, yMax);
    drawGraphs(xMin, xMax, yMin, yMax, steps);
  }

  // Zoom functions
  function zoomIn() {
    const range = zoom.xMax - zoom.xMin;
    const mid = (zoom.xMin + zoom.xMax) / 2;
    zoom.xMin = mid - range / 2 / 1.5;
    zoom.xMax = mid + range / 2 / 1.5;
    updatePlot();
  }
  function zoomOut() {
    const range = zoom.xMax - zoom.xMin;
    const mid = (zoom.xMin + zoom.xMax) / 2;
    zoom.xMin = mid - (range / 2) * 1.5;
    zoom.xMax = mid + (range / 2) * 1.5;
    updatePlot();
  }
  function resetZoom() {
    zoom.xMin = parseFloat(xMinInput.value);
    zoom.xMax = parseFloat(xMaxInput.value);
    updatePlot();
  }

  // Canvas mouse hover for tooltip
  function onMouseMove(e) {
    if (graphs.length === 0) {
      tooltip.style.opacity = 0;
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Map canvas X to data X
    const xVal =
      zoom.xMin +
      ((mouseX - padding) / (canvas.width - 2 * padding)) *
        (zoom.xMax - zoom.xMin);
    if (xVal < zoom.xMin || xVal > zoom.xMax) {
      tooltip.style.opacity = 0;
      return;
    }

    // Find closest y for each graph at xVal
    let closestGraph = null;
    let closestDistance = Infinity;
    let closestY = 0;
    graphs.forEach(({ type, color }) => {
      const y = graphFunctions[type](xVal);
      const yCanvas = mapY(y, zoom.yMin, zoom.yMax);
      const dist = Math.abs(yCanvas - mouseY);
      if (dist < closestDistance) {
        closestDistance = dist;
        closestGraph = { type, color };
        closestY = y;
      }
    });

    // Show tooltip only if close enough to any graph line (within 10 px)
    if (closestDistance < 10) {
      tooltip.style.opacity = 1;
      tooltip.style.left = e.pageX + 15 + "px";
      tooltip.style.top = e.pageY - 30 + "px";
      tooltip.style.backgroundColor = closestGraph.color;
      tooltip.textContent = `${closestGraph.type}(x): (${xVal.toFixed(
        2
      )}, ${closestY.toFixed(2)})`;
    } else {
      tooltip.style.opacity = 0;
    }
  }

  function onMouseLeave() {
    tooltip.style.opacity = 0;
  }

  // Event listeners
  addGraphBtn.addEventListener("click", () => {
    addGraph(graphSelect.value, graphColorInput.value);
  });

  clearGraphsBtn.addEventListener("click", () => {
    graphs = [];
    renderGraphList();
    updatePlot();
  });

  xMinInput.addEventListener("change", () => {
    zoom.xMin = parseFloat(xMinInput.value);
    updatePlot();
  });
  xMaxInput.addEventListener("change", () => {
    zoom.xMax = parseFloat(xMaxInput.value);
    updatePlot();
  });
  stepsInput.addEventListener("change", () => {
    updatePlot();
  });

  zoomInBtn.addEventListener("click", zoomIn);
  zoomOutBtn.addEventListener("click", zoomOut);
  resetZoomBtn.addEventListener("click", resetZoom);

  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseleave", onMouseLeave);

  // Responsive canvas resizing
  function resizeCanvas() {
    const width = Math.min(window.innerWidth - 40, 900);
    canvas.width = width;
    canvas.height = (width * 2) / 3;
    updatePlot();
  }
  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  updatePlot();
})();
