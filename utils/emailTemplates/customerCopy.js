const moment = require("moment");

module.exports = (serviceReport, productVendor) => {
  return `
  <form >
  <fieldset style="background: white; width: 20.8cm; height: 29.3cm; display: block; margin:0; padding:0; font-size: 14px; font-family: Times, serif;">
     <div style="width:100%; margin:0 auto; width: 21cm;">
        <div style="padding: 10px; padding-left: 17px; float:left; width:65% ;text-align: left;">
           <label><strong style="color:#e3242B;">ABC Company Pte Ltd</strong></label>
           <br><label style="font-size: 12px;">123 XYZ Lane 11 Singapore 111111 Tel: (65) 6123 4567 Telefax: (65) 6123 4567 / 6123 4567 </label>
           <br><label style="font-size: 12px; ">Co. Reg No. 123456789R</label>
        </div>
        <div style="padding: 10px; padding-right: 17px; float:right; width:25% ;text-align: right;">
           <label><strong style="color:#e3242B; font-size: 29px; font-family: Arial, Helvetica, sans-serif;">ABC LOGO</strong></label>
        </div>
        <div style="padding-left: 17px; float:left; width:39% ;text-align: left;">
           <label><strong>No.: </strong><span style="color:#e3242B; font-size: 18px; font-family: Arial, Helvetica, sans-serif;">${
             serviceReport.reportNumber
           }</span></label>
        </div>
        <div style="width:40%; float:left;"><span style="text-decoration: underline;font-size: 21px;"><strong>Service Report</strong></span></div>
     </div>
     <div style="width:100%; margin:0 auto; clear: both; padding-top:5">
        <div style="padding-top:5px; padding-left:17px; float:left; width:45%">
           <label><b>Service Date/Time</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px;">${moment(
             serviceReport.serviceDateTime,
             "DD MM YYYY hh:mm"
           ).format("LLL")}
           </p>
           <label><b>Company Name</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px">${serviceReport.companyName}</p>
           <label><b>Address</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px">${
             serviceReport.address ? serviceReport.address : "-"
           }
           </p>
           <label><b>Contact Person Email</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px">${serviceReport.contactPersonEmail}</p>
           <label><b>Chargeable</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px">${
             serviceReport.chargeable ? "yes" : "no"
           }</p>
           <label><b>Product Vendor</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px">${productVendor.name}</p>
        </div>
        <div style=" padding-top:5px; padding-right:17px;  float:right; width:45%">
           <label><b>Completed Date/Time</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px">${moment(
             serviceReport.completedDateTime,
             "DD MM YYYY hh:mm"
           ).format("LLL")}
           </p>
           <label><b>Site</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px">${
             serviceReport.site ? serviceReport.site : "-"
           }
           </p>
           <label><b>Contact Person</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px">${serviceReport.contactPerson}</p>
           <label><b>Telephone</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px">${
             serviceReport.telephone ? serviceReport.telephone : "-"
           }
           </p>
           <label><b>Job Category</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px">${serviceReport.jobCategory}</p>
           <label><b>Ticket Number</b></label>
           <hr style="margin:0; border: 1px solid #bebebe;">
           <p style="margin-top:5px">${serviceReport.ticketNumber}</p>
        </div>
     </div>
     <div style="clear: both;  padding-top:5px; padding-right:17px; padding-left:17px; padding-top: 0px; ">
        <label style=""><b>Action Taken</b></label>
        <hr style="margin:0; border: 1px solid #bebebe;">
        <p style="margin-top:5px; height:75">${serviceReport.actionTaken}</p>
        <label><b>Remarks</b></label>
        <hr style="margin:0; border: 1px solid #bebebe;">
        <p style="margin-top:5px; height:25">${
          serviceReport.remark ? serviceReport.remark : "-"
        }
        </p>
        <label><b>Reason of Equipment Swap</b></label>
        <hr style="margin:0; border: 1px solid #bebebe;">
        <p style="margin-top:5px">${serviceReport.swapReason}</p>
        <table style="width:100%; border: 1px solid black; border-collapse: collapse; text-align: center;font-size: 14px; font-family: Times, serif;">
           <tr>
              <th style="border: 1px solid black; border-collapse: collapse; text-align: center;">Part No.</th>
              <th style="border: 1px solid black; border-collapse: collapse; text-align: center;">From (S/N)</th>
              <th style="border: 1px solid black; border-collapse: collapse; text-align: center;">To (S/N)</th>
           </tr>
           <tr>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[0]
                  ? serviceReport.partNumber[0].partNo
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[0]
                  ? serviceReport.partNumber[0].from
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[0]
                  ? serviceReport.partNumber[0].to
                  : "-"
              }
              </td>
           </tr>
           <tr>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[1]
                  ? serviceReport.partNumber[1].partNo
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[1]
                  ? serviceReport.partNumber[1].from
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[1]
                  ? serviceReport.partNumber[1].to
                  : "-"
              }
              </td>
           </tr>
           <tr>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[2]
                  ? serviceReport.partNumber[2].partNo
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[2]
                  ? serviceReport.partNumber[2].from
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[2]
                  ? serviceReport.partNumber[2].to
                  : "-"
              }
              </td>
           </tr>
           <tr>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[3]
                  ? serviceReport.partNumber[3].partNo
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[3]
                  ? serviceReport.partNumber[3].from
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[3]
                  ? serviceReport.partNumber[3].to
                  : "-"
              }
              </td>
           </tr>
           <tr>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[4]
                  ? serviceReport.partNumber[4].partNo
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[4]
                  ? serviceReport.partNumber[4].from
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[4]
                  ? serviceReport.partNumber[4].to
                  : "-"
              }
              </td>
           </tr>
           <tr>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[5]
                  ? serviceReport.partNumber[5].partNo
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[5]
                  ? serviceReport.partNumber[5].from
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[5]
                  ? serviceReport.partNumber[5].to
                  : "-"
              }
              </td>
           </tr>
           <tr>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[6]
                  ? serviceReport.partNumber[6].partNo
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[6]
                  ? serviceReport.partNumber[6].from
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[6]
                  ? serviceReport.partNumber[6].to
                  : "-"
              }
              </td>
           </tr>
           <tr>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[7]
                  ? serviceReport.partNumber[7].partNo
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[7]
                  ? serviceReport.partNumber[7].from
                  : "-"
              }
              </td>
              <td style="border: 1px solid black; border-collapse: collapse; text-align: center;">${
                serviceReport.partNumber[7]
                  ? serviceReport.partNumber[7].to
                  : "-"
              }
              </td>
           </tr>
        </table>
     </div>
     <div style="position:absolute; bottom:61; padding-top:5px; padding-right:17px; padding-left:17px; padding-top: 0px; width: 20.09cm;">
        <p>I/We* undersigned confirmed that the equipment has been serviced and in working condition.
           Cost of parts replaced due to accident, neglects, abuse, misuse of any other apart from ordinary use of equipment shall be borne by the user.
        </p>
        <div style="width:100%; margin:0 auto">
           <div style="padding-top:10px;  float:left; width:40% ;text-align: center;">
              <img src=${
                serviceReport.userSignature
              } alt="signature" width="200px" height="100px">
           </div>
           <div style="padding-top:10px; float:right; width:40% ;text-align: center;">
              <img src=${
                serviceReport.customerSignature
              } alt="signature" width="200px" height="100px">
           </div>
        </div>
        <div style="width:100%; margin:0 auto">
           <div style="float:left; width:45% ;text-align: left;  padding-left:16px">
              <label>${serviceReport.signedByUser}</label>
           </div>
           <div style="float:right; width:45% ;text-align: right;  padding-right:16px">
              <label>${serviceReport.signedBy}</label>
           </div>
        </div>        
        <div style="width:100%; margin:0 auto">
           <div style="float:left; width:45% ;text-align: left;  padding-left:16px">
              <hr style="border: 1px solid #000000;">
              <label><b>Engineer Name & Signature</b></label>
           </div>
           <div style="float:right; width:45% ;text-align: right;  padding-right:16px">
              <hr style="border: 1px solid #000000;">
              <label><b>Customer Signature</b></label>
           </div>
        </div>
     </div>
  </fieldset>
</form>
`;
};
