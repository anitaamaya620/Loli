const flavors = {
  clasico: { name: "Clásico", price: 3.5 },
  arequipe: { name: "Arequipe", price: 4.2 },
  chocolate: { name: "Chocolate", price: 4.2 },
  apple: { name: "Apple Cinnamon", price: 4.2 },
};
const counts = { clasico: 0, arequipe: 0, chocolate: 0, apple: 0 };
const form = document.querySelector("#pedido");
const rollCount = document.querySelector("#rollCount");
const deliveryNote = document.querySelector("#deliveryNote");
const totalElement = document.querySelector("#total");
const formError = document.querySelector("#formError");

function totals() {
  const rolls = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const total = Object.entries(counts).reduce((sum, [id, count]) => sum + flavors[id].price * count, 0);
  return { rolls, total };
}

function render() {
  document.querySelectorAll("[data-flavor]").forEach((card) => {
    const id = card.dataset.flavor;
    card.querySelector("strong").textContent = counts[id];
    card.querySelector('[data-action="remove"]').disabled = counts[id] === 0;
  });
  const { rolls, total } = totals();
  rollCount.textContent = `${rolls} ${rolls === 1 ? "roll" : "rolls"}`;
  totalElement.textContent = `$${total.toFixed(2)}`;
  deliveryNote.textContent = rolls >= 3 ? "Delivery gratis ✓" : "Delivery gratis desde 3 rolls";
}

document.querySelectorAll(".stepper button").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.closest("[data-flavor]").dataset.flavor;
    counts[id] = Math.max(0, counts[id] + (button.dataset.action === "add" ? 1 : -1));
    formError.hidden = true;
    render();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const { rolls, total } = totals();
  const name = document.querySelector("#name").value.trim();
  const phone = document.querySelector("#phone").value.trim();
  const deliveryDay = document.querySelector("#deliveryDay").value;
  const address = document.querySelector("#address").value.trim();
  const details = document.querySelector("#details").value.trim();

  if (!rolls) {
    formError.textContent = "Elige al menos un roll para continuar.";
    formError.hidden = false;
    return;
  }
  if (!name || !phone || !deliveryDay || !address) {
    formError.textContent = "Completa tu nombre, teléfono, día de entrega y dirección.";
    formError.hidden = false;
    return;
  }

  const items = Object.entries(counts)
    .filter(([, count]) => count)
    .map(([id, count]) => `• ${count} × ${flavors[id].name} — $${(count * flavors[id].price).toFixed(2)}`)
    .join("\n");
  const message = `Hola, quiero hacer este pedido de LOLI:\n\n${items}\n\nTotal: $${total.toFixed(2)}\nRollos: ${rolls}\nDía de entrega: ${deliveryDay}\n\nNombre: ${name}\nTeléfono: ${phone}\nDirección: ${address}${details ? `\nIndicaciones: ${details}` : ""}\n\nVi los datos de pago en la página. ¿Me confirmas disponibilidad y hora de entrega?`;
  window.location.href = `https://wa.me/584147071150?text=${encodeURIComponent(message)}`;
});

render();
