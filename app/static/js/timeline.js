// js of timeline page
const input = document.querySelector("input[name='date']");
const date = input.value;

// Зберігаємо дату у базу даних
const citySelect = document.getElementById("city");
citySelect.disabled = false;

const propertyTypeSelect = document.getElementById("property_type");
propertyTypeSelect.disabled = false;