
let current_time = new Date();
let formatted_time = current_time.toLocaleString("en-US", {timeStyle: "short"});

window.onload = (event) => {
  console.log("page is fully loaded");
  let container = document.getElementById('now');
  container.innerText = formatted_time;
};