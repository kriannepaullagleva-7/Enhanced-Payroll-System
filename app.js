const form = document.getElementById("payrollForm");

const empName = document.getElementById("empName");
const hours = document.getElementById("hours");
const rate = document.getElementById("rate");
const tax = document.getElementById("tax");
const otherDed = document.getElementById("otherDed");

const tbody = document.getElementById("payrollTbody");

const sumEmployees = document.getElementById("sumEmployees");
const sumGross = document.getElementById("sumGross");
const sumDed = document.getElementById("sumDed");
const sumNet = document.getElementById("sumNet");

const resetBtn = document.getElementById("resetBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const submitBtn = document.getElementById("submitBtn");
const msg = document.getElementById("msg");

let editRow = null;

function money(num){
  return "₱" + num.toFixed(2);
}

function updateSummary(){
  let rows = tbody.querySelectorAll("tr");
  let gross = 0;
  let ded = 0;
  let net = 0;

  rows.forEach(row => {
    gross += parseFloat(row.children[4].textContent);
    ded += parseFloat(row.children[5].textContent)
         + parseFloat(row.children[6].textContent);
    net += parseFloat(row.children[7].textContent);
  });

  sumEmployees.textContent = rows.length;
  sumGross.textContent = money(gross);
  sumDed.textContent = money(ded);
  sumNet.textContent = money(net);
}

function updateNumbers(){

  let rows = tbody.querySelectorAll("tr");
  rows.forEach((row, i)=>{
    row.children[0].textContent = i + 1;
  });

}


function clearForm(){
  form.reset();
  tax.value = 10;
  otherDed.value = 0;
  editRow = null;
  submitBtn.textContent = "Add Payroll";
  msg.textContent = "";
}


form.addEventListener("submit", function(e){

  e.preventDefault();
  let name = empName.value.trim();
  let h = parseFloat(hours.value);
  let r = parseFloat(rate.value);
  let t = parseFloat(tax.value);
  let o = parseFloat(otherDed.value);
  let gross = h * r;
  let taxDed = gross * (t / 100);
  let net = gross - taxDed - o;
  if(editRow === null){
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td></td>
      <td>${name}</td>
      <td>${h}</td>
      <td>${r}</td>
      <td>${gross.toFixed(2)}</td>
      <td>${taxDed.toFixed(2)}</td>
      <td>${o.toFixed(2)}</td>
      <td>${net.toFixed(2)}</td>
      <td>
        <button class="secondary editBtn">Edit</button>
        <button class="secondary delBtn">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);

    msg.textContent = "Added successfully ✔";

  }else{

    editRow.children[1].textContent = name;
    editRow.children[2].textContent = h;
    editRow.children[3].textContent = r;
    editRow.children[4].textContent = gross.toFixed(2);
    editRow.children[5].textContent = taxDed.toFixed(2);
    editRow.children[6].textContent = o.toFixed(2);
    editRow.children[7].textContent = net.toFixed(2);

    msg.textContent = "Updated ✔";
  }

  updateNumbers();
  updateSummary();
  clearForm();

});


tbody.addEventListener("click", function(e){
  if(e.target.classList.contains("delBtn")){
    if(confirm("Delete this record?")){
      e.target.closest("tr").remove();
      updateNumbers();
      updateSummary();
      msg.textContent = "Deleted ❌";
    }
  }


  if(e.target.classList.contains("editBtn")){
    editRow = e.target.closest("tr");
    empName.value = editRow.children[1].textContent;
    hours.value = editRow.children[2].textContent;
    rate.value = editRow.children[3].textContent;
    let gross = parseFloat(editRow.children[4].textContent);
    let taxDed = parseFloat(editRow.children[5].textContent);
    tax.value = ((taxDed / gross) * 100).toFixed(2);
    otherDed.value = editRow.children[6].textContent;
    submitBtn.textContent = "Update Payroll";
    msg.textContent = "Editing ✏️";
  }

});


resetBtn.addEventListener("click", clearForm);

clearAllBtn.addEventListener("click", function(){
  if(confirm("Clear all records?")){
    tbody.innerHTML = "";
    updateSummary();
    clearForm();
    msg.textContent = "All cleared ❗";
  }

});
