//const axios = require("axios");
//const jsdom = require("jsdom");
//const cheerio = require("cheerio")
const puppeteer = require("puppeteer")
    //const { JSDOM } = jsdom;


async function getInfoProject(link) {
    console.log("inside");

    var browser = await puppeteer.launch({ headless: false }); //args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    var page = (await browser.pages())[0];
    page.setDefaultNavigationTimeout(0);
    await page.goto(link, { waitUntil: 'networkidle2' });

    let info = await page.evaluate(() => {


        var title = document.querySelector("h1#projects-title");
        var objective = document.querySelector("div.more._loop_lead_paragraph_sm");
        var country = document.querySelectorAll("p.document-info")[4];
        var status = document.querySelectorAll("p.document-info")[1];
        var task_manager = document.querySelectorAll("p.document-info")[2];
        var region = document.querySelectorAll("p.document-info")[9];
        var total_cost = document.querySelectorAll("p.document-info")[11];
        var approval_date = document.querySelectorAll("p.document-info")[6];
        var project_id = document.querySelectorAll("p.document-info")[0];
        var closed_date = document.querySelectorAll("p.document-info")[14];
        var implementer = document.querySelectorAll("p.document-info")[8];
        var source_financing = document.querySelector("td.ng-tns-c5-1");
        var sector = document.querySelector("div.row.ng-star-inserted");
        if (sector == null) {
            sector = null;
        } else {
            sector = [];
            var sectors = document.querySelectorAll("g.highcharts-legend")[0].querySelector("g > g > g").querySelectorAll("text");
            for (var i = 0; i < sectors.length; i++) {
                var titres = sectors[i].querySelectorAll("tspan");
                var titre = "";
                for (var j = 0; j < titres.length; j++) {
                    titre += " " + titres[j].textContent;
                }

                sector.push(titre);
            }
        }



        var proj = {

            "Project Id": project_id.innerText,
            "Name": title.innerText,
            "Country": country.innerText == "N/A" ? null : country.innerText,
            "Objective": objective.innerText,
            "Status": status.innerText == "N/A" ? null : status.innerText,
            "Region": region.innerText == "N/A" ? null : region.innerText,
            "Total Cost": total_cost.innerText == "N/A" ? null : total_cost.innerText,
            "Approval Date": approval_date.innerText == "N/A" ? null : approval_date.innerText,
            "Task manager": task_manager.innerText == "N/A" ? null : task_manager.innerText,
            "Sector": sector,
            "End Date": closed_date.innerText == "N/A" ? null : closed_date.innerText,
            "Implementing Agency": implementer.innerText == "N/A" ? null : implementer.innerText,
            "Source of financing": source_financing.innerText == "N/A" ? null : source_financing.innerText,

        };

        return proj;
    });
    await browser.close();

    return info;

}

async function getProLink(wburl) {


    var browser = await puppeteer.launch({ headless: true }); //args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    var page = (await browser.pages())[0];
    page.setDefaultNavigationTimeout(0);
    await page.goto(wburl, { waitUntil: 'networkidle2' });

    let data = await page.evaluate(() => {

        var project_ids = document.querySelectorAll("td[data-th='Project ID:']");
        var project_liens = Array.from(project_ids, a => "https://projects.worldbank.org/en/projects-operations/project-detail/" + a.innerText);


        return project_liens;

    });
    await browser.close();

    return data;
}

exports.getWBProjects = async(req, res, next) => {

    base_url = "https://projects.worldbank.org/en/projects-operations/projects-list?os=160";
    var page = 0;
    //var url = base_url  ;

    const links = await getProLink(base_url);

    console.log(links);
    let projects = []

    for (var i = 0; i < links.length; i++) {

        var project = await getInfoProject(links[i]);
        projects.push(project);
        break;
    }

    res.status(200).json(projects);
};