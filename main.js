let total = 0;
let editMode = false;
let editIndex = null;
let savedTitle = "";
const tableBody = document.getElementById("tableBody");

function initEmptyRows() {
  for (let i = 0; i < 10; i++) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td> </td><td></td><td></td><td></td><td></td><td></td>";
    tableBody.appendChild(tr);
  }
}

function appendRow(volume, count, length, width, height, rowNumber) {
  const tr = document.createElement("tr");
  tr.classList.add("filled");
  tr.innerHTML = `<td>${volume}</td><td>${count}</td><td>${length}</td><td>${width}</td><td>${height}</td><td>${rowNumber}</td>`;
  tr.onclick = () => {
    if (editMode) {
      document.getElementById("rowNumber").value = rowNumber;
      document.getElementById("height").value = height;
      document.getElementById("width").value = width;
      document.getElementById("length").value = length;
      document.getElementById("count").value = count;
      editIndex = [...tableBody.children].indexOf(tr);
      document.getElementById("deleteBtn").style.display = "inline-block";
    }
  };
  const filled = tableBody.querySelectorAll("tr.filled").length;
  if (filled < 10) tableBody.replaceChild(tr, tableBody.children[filled]);
  else tableBody.appendChild(tr);
}

document.getElementById("packingForm").onsubmit = function(e) {
  e.preventDefault();
  const h = +document.getElementById("height").value;
  const w = +document.getElementById("width").value;
  const l = +document.getElementById("length").value;
  const c = +document.getElementById("count").value;
  const r = document.getElementById("rowNumber").value;

  if (isNaN(h) || isNaN(w) || isNaN(l) || isNaN(c) || h <= 0 || w <= 0 || l <= 0 || c <= 0) {
    alert("مقادیر معتبر وارد کنید.");
    return;
  }

  const v = ((h * w * l * c) / 10000).toFixed(2);
  total += +v;
  document.getElementById("totalVolume").textContent = total.toFixed(2);

  if (editIndex !== null) {
    tableBody.children[editIndex].remove();
    editIndex = null;
  }

  appendRow(v, c, l, w, h, r);
  this.reset();
  document.getElementById("deleteBtn").style.display = "none";
};

function deleteRow() {
  if (editIndex !== null) {
    tableBody.children[editIndex].remove();
    editIndex = null;
    document.getElementById("packingForm").reset();
    document.getElementById("deleteBtn").style.display = "none";
  }
}

function enableEditMode() {
  editMode = true;
  alert("حالت ویرایش فعال شد. روی ردیف کلیک کنید.");
}

function savePacking() {
  const title = document.getElementById("listTitle").value;
  if (!title.trim()) {
    alert("عنوان لیست را وارد کنید.");
    return;
  }
  const table = tableBody.innerHTML;
  const totalVal = document.getElementById("totalVolume").textContent;
  const data = { title, table, total: totalVal };
  localStorage.setItem("paksaz-" + title, JSON.stringify(data));
  alert("✅ ذخیره شد.");
}

function loadPacking() {
  const title = prompt("عنوان پکینگ برای بارگذاری:");
  if (!title) return;
  const saved = localStorage.getItem("paksaz-" + title);
  if (!saved) return alert("پکینگی با این عنوان ذخیره نشده.");
  const data = JSON.parse(saved);
  document.getElementById("listTitle").value = data.title;
  tableBody.innerHTML = data.table;
  document.getElementById("totalVolume").textContent = data.total;
  total = +data.total;
}

function newPacking() {
  tableBody.innerHTML = "";
  initEmptyRows();
  total = 0;
  document.getElementById("totalVolume").textContent = "0";
  document.getElementById("packingForm").reset();
}

function addWatermark() {
  const watermark = document.createElement("div");
  watermark.id = "watermark";
  watermark.textContent = "پــک ســاز";
  watermark.style.position = "absolute";
  watermark.style.top = "65%";
  watermark.style.left = "50%";
  watermark.style.transform = "translate(-50%, -50%) rotate(-30deg)";
  watermark.style.fontSize = "80px";
  watermark.style.fontFamily = "Vazirmatn-ExtraBold";
  watermark.style.color = "rgba(30,78,47,0.05)";
  watermark.style.pointerEvents = "none";
  watermark.style.zIndex = "0";
  document.getElementById("outputArea").appendChild(watermark);
}

function removeWatermark() {
  const wm = document.getElementById("watermark");
  if (wm) wm.remove();
}

function saveJPEG() {
  addWatermark();
  html2canvas(document.getElementById("outputArea"), { scale: 2 }).then(canvas => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg");
    a.download = "paksaz.jpg";
    a.click();
    removeWatermark();
  });
}

function savePDF() {
  addWatermark();
  html2canvas(document.getElementById("outputArea"), { scale: 2 }).then(canvas => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("paksaz.pdf");
    removeWatermark();
  });
}


window.onload = () => {
  initEmptyRows();
};
function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.classList.toggle("show");
}

// بستن منو با کلیک یا لمس بیرون از منو
function closeMenuOnOutsideClick(e) {
  const menu = document.getElementById("sideMenu");
  const icon = document.querySelector(".menu-icon");
  if (
    !menu.contains(e.target) &&
    !icon.contains(e.target) &&
    menu.classList.contains("show")
  ) {
    menu.classList.remove("show");
  }
}

window.addEventListener("click", closeMenuOnOutsideClick);
window.addEventListener("touchstart", closeMenuOnOutsideClick);

