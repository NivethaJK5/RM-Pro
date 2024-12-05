using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NPOI.SS.Formula.Functions;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using RMPro.Models;
using System;
using System.Data;
using System.Diagnostics;
using System.Net.Mail;
using System.Net;

namespace RmPro.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly string _connectionString = "Data Source=DESKTOP-RD6GK12; Initial Catalog=RmPro; Integrated Security=True; TrustServerCertificate=True";
        
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Login()
        {
            return View();
            //return RedirectToAction("Enquiry", "Home");

        }
        public IActionResult Dashboard()
        {
            return View();
        }
        public IActionResult Enquiry()
        {
            return View();
        }

        public IActionResult GeneralMaster()
        {
            return View();
        }

        
        public IActionResult ProductMaster()
        {
            return View();
        }

        public IActionResult ProductCompositionMaster()
        {
            return View();
        }

        public IActionResult ProductWeightMaster()
        {
            return View();
        }

        public IActionResult VendorMaster()
        {
            return View();
        }

        public IActionResult CustomerMaster()
        {
            return View();
        }

        public IActionResult CommodityMaster()
        {
            return View();
        }

        public IActionResult CommodityExchangeCombination()
        {
            return View();
        }

        public IActionResult MasterImport()
        {
            return View();
        }

		public IActionResult PriceEntry()
		{

			return View();
		}
        public IActionResult PriceCalcReport()
        {

            return View();
        }

		public IActionResult ShouldCostEnquiry()
		{

			return View();
		}

		public IActionResult ShouldCostEntry()
		{

			return View();
		}
		public IActionResult ShouldCostImport()
		{

			return View();
		}

        public IActionResult ShouldCostReport()
        {

            return View();
        }

        public IActionResult BOM()
        {

            return View();
        }
        public IActionResult PurchaseDetailsReport()
        {

            return View();
        }

        public IActionResult CommodityPriceMovementReport()
        {

            return View();
        }

        public IActionResult ExchangeRateReport()
        {

            return View();
        }
        




        [HttpPost]
        public IActionResult LoginData([FromBody] LoginModel model)
        {
            string username = model.username;
            string password = model.password;

            string query = "SELECT COUNT(*) AS UserCount, UserRoll FROM UserDetails WHERE UserName = @Username AND UserPassword = @Password GROUP BY UserRoll";
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                con.Open();
                SqlCommand com = new SqlCommand(query, con);
                com.Parameters.AddWithValue("@Username", username);
                com.Parameters.AddWithValue("@Password", password);

                using (SqlDataReader reader = com.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        int userCount = (int)reader["UserCount"];
                        string userRoll = reader["UserRoll"].ToString();

                        if (userCount == 1)
                        {
                            return Json(new
                            {
                                success = true,
                                redirectToUrl = Url.Action("Dashboard", "Home"),
                                uname = username,
                                userRoll = userRoll
                            });
                        }
                    }
                }

                // If no rows were found or multiple rows were found, return failed login
                return Json(new { success = false, message = "Failed to login" });
            }
        }





        //getEnquiryData
        [HttpGet]
        public object GetData(string pageid, string code, string vendorcode, string materialJson)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();
                    string _data = "";
                    SqlCommand com = new SqlCommand("Prc_GetData", con);
                    com.CommandType = CommandType.StoredProcedure;

                    com.Parameters.AddWithValue("@pageid", pageid);
                    com.Parameters.AddWithValue("@code", code);
                    com.Parameters.AddWithValue("@vendorcode", vendorcode);
                    com.Parameters.AddWithValue("@materialJson", materialJson);

                    SqlDataAdapter da = new SqlDataAdapter(com);
                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    con.Close();
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                      
                        _data = JsonConvert.SerializeObject(ds.Tables[0]);
                        return _data;

                    }
                    else
                    {
                        return new { success = false, message = "No data found for the provided page ID." };
                    }
                }
            }
            catch (SqlException ex)
            {
                return new { success = false, message = ex.Message };
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return new { success = false, message = ex.Message };
            }
        }

        [HttpPost]
        public ActionResult InsertData([FromBody] DataModel model)
        {
            try
            {
                string action = model.action;
                string pageid = model.pgid;
                string detailjson = model.detailjson;

                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();
                    SqlCommand com = new SqlCommand("DataInsert", con);
                    com.CommandType = CommandType.StoredProcedure;

                    com.Parameters.AddWithValue("@action", action);
                    com.Parameters.AddWithValue("@pageid", pageid);
                    com.Parameters.AddWithValue("@detailjsondata", detailjson);

                    // Execute the command and handle errors
                    com.ExecuteNonQuery();
                }
                if(action == "INSERT")
                {
                    return Json(new { success = true, message = "Data added successfully." });
                } else
                {
                    return Json(new { success = true, message = "Data updated successfully." });
                }
                
            }
      
            catch (Exception ex)
            {
                // For any other unexpected errors, return a generic error message
                return Json(new { success = false, message = ex.Message });
            }
        }

        //getMasterData
        [HttpGet]
        public object GetMasterData(string pageid, string code, string displaycnt, string sp_name)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();
                    string _data = "";
                    SqlCommand com = new SqlCommand(sp_name, con);
                    com.CommandType = CommandType.StoredProcedure;

                    com.Parameters.AddWithValue("@pageid", pageid);
                    com.Parameters.AddWithValue("@code", code);
                    com.Parameters.AddWithValue("@disply", displaycnt);

                    SqlDataAdapter da = new SqlDataAdapter(com);
                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    con.Close();
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        _data = JsonConvert.SerializeObject(ds.Tables[0]);
                        return _data;

                    }
                    else
                    {
                        return new { success = false, message = "No data found for the provided page ID." };
                    }
                }
            }
            catch (SqlException ex)
            {
                return new { success = false, message = ex.Message };
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return new { success = false, message = ex.Message };
            }
        }

        [HttpGet]
        public object DropdownData(string pageid, string param)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();
                    string _data = "";
                    SqlCommand com = new SqlCommand("Prc_DropDown", con);
                    com.CommandType = CommandType.StoredProcedure;

                    com.Parameters.AddWithValue("@pageid", pageid);
                    com.Parameters.AddWithValue("@param", param);

                    SqlDataAdapter da = new SqlDataAdapter(com);
                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    con.Close();
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        _data = JsonConvert.SerializeObject(ds.Tables[0]);
                        return new { success = true, _data };

                    }
                    else
                    {
                        return new { success = false, message = "No data found for the provided page ID." };
                    }
                }
            }
            catch (SqlException ex)
            {
                return new { success = false, message = ex.Message };
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return new { success = false, message = ex.Message };
            }
        }


        [HttpPost]
        public ActionResult ImportMaster(string category, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return Json(new { success = false, message = "Please provide a valid file." });

                List<Dictionary<object, object>> excelData = new List<Dictionary<object, object>>();

                using (var stream = file.OpenReadStream())
                {
                    XSSFWorkbook workbook = new XSSFWorkbook(stream);
                    ISheet sheet = workbook.GetSheetAt(0); // Assuming the first sheet

                    // Get the header row
                    IRow headerRow = sheet.GetRow(0);
                    Dictionary<int, string> columnMap = new Dictionary<int, string>();

                    for (int j = 0; j < headerRow.LastCellNum; j++)
                    {
                        ICell headerCell = headerRow.GetCell(j);
                        if (headerCell != null)
                        {
                            string headerName = headerCell.ToString();
                            columnMap.Add(j, headerName);
                        }
                    }

                    for (int i = 0; i <= sheet.LastRowNum; i++)
                    {
                        IRow row = sheet.GetRow(i);
                        // checking Row is null or all cells are empty
                        if (row == null || row.Cells.All(c => string.IsNullOrWhiteSpace(c?.ToString())))
                        {
                            Console.WriteLine($"Skipping row {i + 1}: Row is null or all cells are empty.");
                            continue;
                        }

                        // Skip the header row
                        if (i == 0)
                        {
                            Console.WriteLine($"Skipping header row.");
                            continue;
                        }

                        Dictionary<object, object> rowData = new Dictionary<object, object>();

                        // Iterate over cells in the row
                        for (int j = 0; j < row.LastCellNum; j++)
                        {
                            ICell cell = row.GetCell(j);
                            if (cell == null || cell.ToString() == "")
                            {
                               // Console.WriteLine($"Skipping cell {j + 1}: Cell is null or empty.");
                                continue;
                            }

                            // Extract data from the cell using the header name
                            string columnName = columnMap.ContainsKey(j) ? columnMap[j] : $"Column{j + 1}";
                            string cellValue = cell.ToString();                            
                            rowData.Add(columnName, cellValue);
                        }

                        // Check if rowData is not null or empty before adding it to excelData
                        if (rowData.Count > 0)
                        {                           
                            excelData.Add(rowData);
                           // Console.WriteLine($"Added row {i + 1} to excelData.");
                        }
                        
                    }

                }
				
				var dataJson = JsonConvert.SerializeObject(excelData, Formatting.Indented);
                //add validation here...
                //Console.WriteLine(dataJson);
                validateData(dataJson);
				try
                {
                    string action = "INSERT";

                    using (SqlConnection con = new SqlConnection(_connectionString))
                    {
                        con.Open();
                        SqlCommand com = new SqlCommand("DataInsert", con);
                        com.CommandType = CommandType.StoredProcedure;

                        com.Parameters.AddWithValue("@action", action);
                        com.Parameters.AddWithValue("@pageid", category);
                        com.Parameters.AddWithValue("@detailjsondata", dataJson);

                        // Execute the command and handle errors
                        com.ExecuteNonQuery();
                    }

                    return Json(new { success = true, message = "Data Imported successfully." });
                }
                catch (SqlException ex)
                {
                    // If a SQL error occurs, return the error message to the client
                    return Json(new { success = false, message = ex.Message });
                }

            }
            catch (Exception ex)
            {
                // For any other unexpected errors, return a generic error message
                return Json(new { success = false, message = "An error occurred while processing your request." });
            }
        }

		private void validateData(string dataJson)
		{
			// Deserialize JSON string to dynamic object
			var listDynamic = JsonConvert.DeserializeObject<List<dynamic>>(dataJson);

			foreach (var list in listDynamic)
			{

				//Console.WriteLine($"Product Code: {list.Product_Code}");
				
			}

		}



        [HttpPost]
        public ActionResult InsertPriceData([FromBody] DataModel model)
        {
            try
            {

                string pageid = model.pgid;
                string action = model.action;                
                string detailjson = model.detailjson;
                string prc = model.prc;

                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();
                    SqlCommand com = new SqlCommand(prc, con);
                    com.CommandType = CommandType.StoredProcedure;

                    com.Parameters.AddWithValue("@action", action);
                    com.Parameters.AddWithValue("@pageid", pageid);
                    com.Parameters.AddWithValue("@detailjson", detailjson);

                    int rowsAffected = com.ExecuteNonQuery();
                    if (rowsAffected > 0)
                    {
                        return Json(new
                        {
                            success = true,
                            message = "Data added successfully.",
                            redirectToUrl = Url.Action("Enquiry", "Home")
                        });
                    }
                    else
                    {
                        // Handle case when no rows are affected
                        return Json(new
                        {
                            success = false,
                            message = "No data was added.",
                            redirectToUrl = Url.Action("Enquiry", "Home")
                        });
                    }
                }

            }

            catch (Exception ex)
            {
                // Handle case when no rows are affected
                return Json(new
                {
                    success = false,
                    message = "No data was added.",
                    redirectToUrl = Url.Action("Enquiry", "Home")
                });
            }
        }

        [HttpGet]
        public object GetPriceData(string pageid, string prc, string jsonData)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();
                    string _data = "";
                    SqlCommand com = new SqlCommand(prc, con);
                    com.CommandType = CommandType.StoredProcedure;

                    com.Parameters.AddWithValue("@action", "Read");
                    com.Parameters.AddWithValue("@pageid", pageid);
                    com.Parameters.AddWithValue("@detailjson", jsonData);

                    SqlDataAdapter da = new SqlDataAdapter(com);
                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    con.Close();
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        _data = JsonConvert.SerializeObject(ds.Tables[0]);
                        return _data;

                    }
                    else
                    {
                        return new { success = false, message = "No data found for the provided page ID." };
                    }
                }
            }
            catch (SqlException ex)
            {
                return new { success = false, message = ex.Message };
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return new { success = false, message = ex.Message };
            }
        }








        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }


        

    }



	
}
