using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace latlng.Controllers
{
    [Route("api/[controller]")]
    public class GeocodeController : Controller
    {
        // GET: api/<controller>
        [HttpGet]
        public async Task<string> GetByAddress()
        {
            const string url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
            const string apiKey = "AIzaSyCqCAONwLpj2Z4TrykNyaVFw7uDHZ-OiOQ";
            string address = Request.Query["address"];
            string requestUrl = url + address + "&key=" + apiKey;

            using (HttpClient client = new HttpClient())
            {
                using (HttpResponseMessage response = await client.GetAsync(requestUrl))
                {
                    using (HttpContent content = response.Content)
                    {
                        string data = await content.ReadAsStringAsync();
                        return data;
                    }
                }
            }
        }
    }
}
