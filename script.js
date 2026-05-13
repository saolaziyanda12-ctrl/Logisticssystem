const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const deliveryForm = document.getElementById("deliveryForm");
const deliveryTable = document.getElementById("deliveryTable");
const parcelImageInput = document.getElementById("parcelImage");

let deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
let editId = null;

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 450);
});

setInterval(() => {
    document.getElementById("clock").innerText = new Date().toLocaleTimeString();
}, 1000);

function displayDeliveries() {
    deliveryTable.innerHTML = "";
    deliveries.forEach((d) => {
        deliveryTable.innerHTML += `
            <tr>
                <td><strong>CTE-${d.id.toString().slice(-5)}</strong></td>
                <td>${d.image ? `<img src="${d.image}" class="delivery-img">` : 'No Photo'}</td>
                <td>${d.customer}</td>
                <td>${d.address}</td>
                <td style="color: ${d.status === 'Completed' ? '#27ae60' : '#004d4d'}; font-weight: bold;">${d.status}</td>
                <td>
                    <button onclick="deleteDelivery(${d.id})" style="color:red; background:none; border:none; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    updateStats();
}

deliveryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = parcelImageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => saveProcess(reader.result);
        reader.readAsDataURL(file);
    } else {
        saveProcess("");
    }
});

function saveProcess(imgBase64) {
    const data = {
        id: Date.now(),
        customer: document.getElementById("customer").value,
        address: document.getElementById("address").value,
        status: document.getElementById("status").value,
        image: imgBase64
    };
    deliveries.unshift(data);
    localStorage.setItem("deliveries", JSON.stringify(deliveries));
    displayDeliveries();
    deliveryForm.reset();
}

function updateStats() {
    document.getElementById("totalDeliveries").innerText = deliveries.length;
    document.getElementById("progressDeliveries").innerText = deliveries.filter(d => d.status === "In Progress").length;
    document.getElementById("completedDeliveries").innerText = deliveries.filter(d => d.status === "Completed").length;
    document.getElementById("failedDeliveries").innerText = deliveries.filter(d => d.status === "Failed").length;
}

function deleteDelivery(id) {
    deliveries = deliveries.filter(d => d.id !== id);
    localStorage.setItem("deliveries", JSON.stringify(deliveries));
    displayDeliveries();
}

const map = L.map("map").setView([-26.2041, 28.0473], 6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
L.marker([-26.2041, 28.0473]).addTo(map).bindPopup("Truck 01 - John");

displayDeliveries();