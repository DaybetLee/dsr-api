module.exports = (serviceReport) => {
  return `
    <p>Hi Team,</p>
    <p>Please kindly assist to update (<span style="font-weight: bold">${
      serviceReport.companyName
    }</span>)'s inventory:</p>
    <p>
        Type of Movement: ${serviceReport.movementType}
      <br>RMA#: Pending
      <br>Vendor: ${serviceReport.productVendor}
      <br>Ticket#: ${serviceReport.ticketNumber}
      <br>Customer: ${serviceReport.companyName}
      <br>Model/Part #.: ${objArrToUniqueStr(
        serviceReport.partNumber,
        "partNo"
      )}
      <br>Old/Faulty serial: ${objArrToStr(serviceReport.partNumber, "from")}
      <br>New serial (From Spare): ${objArrToStr(
        serviceReport.partNumber,
        "to"
      )}
      <br>Replacement from Vendor: N.A
      <br>Remarks: ${serviceReport.movementRemark}
    </p>
    <footer>
      <hr>
      <a>This is an auto-generated email; please do not reply to this email.</a>
    </footer>
    `;
};

function objArrToUniqueStr(arr, key) {
  let newArr = [];
  for (index in arr) newArr.push(arr[index][key]);
  return [...new Set(newArr)].join(", ");
}

function objArrToStr(arr, key) {
  let newArr = [];
  for (index in arr) newArr.push(arr[index][key]);
  return newArr.join(", ");
}
