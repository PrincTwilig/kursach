// js of search page
const citySelect = document.getElementById("city");
citySelect.disabled = false;

const propertyTypeSelect = document.getElementById("property_type");
propertyTypeSelect.disabled = false;

function handleChange() {
    const input = document.querySelector("#prices");
    const selectedOption = input.options[input.selectedIndex];
    const value = selectedOption ? selectedOption.value : input.value;
    return value;
}

function handleChange() {
    const input = document.querySelector("#square_meters");
    const selectedOption = input.options[input.selectedIndex];
    const value = selectedOption ? selectedOption.value : input.value;
    return value;
  }
  
const button = document.querySelector("button");
button.addEventListener("click", () => {
    const price = handleChange();
    // Виконати пошук з ціною price
});
