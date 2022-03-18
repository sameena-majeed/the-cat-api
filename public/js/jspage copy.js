
let categoryOptions = document.getElementById("category");

class LoadCategoriesAndBreed {

    constructor() {
        this.categorySelected;

        this.categoryIdSelected = "";
        this.categoryNames;
        this.categoryIds;
        this.breedSelected;
        this.breedNames;
        this.breedIds;
        this.breedIdSelected = "";
        this.breedNameSelected = "";
        
    }
    // https://api.thecatapi.com/v1/breeds
    async listCategories() {
        const url = "https://api.thecatapi.com/v1/categories";
        let response = await fetch(url, {
            method: "GET",
            withCredentials: true,
            headers: {
                "X-Auth-Token": "54a5f952-dd2e-4bb4-9d56-55c6ff1fcc23",
                "Content-Type": "application/json"
            }
        });
        let data = await response.json();

        this.categoryNames = data.map(eachData => eachData.name);
        this.categoryIds = data.map(eachData => eachData.id);

        console.log("first");
        for (let i = 0; i < this.categoryNames.length; i++) {
            let newOption = new Option(`${this.categoryNames[i]}`, `${this.categoryNames[i]}`);
            newOption.id = `${this.categoryIds[i]}`;
            console.log(newOption.id + "  op ids")
            categoryOptions.add(newOption, undefined);
        }

        categoryOptions.addEventListener('change', (e) => {
            console.log(e);
            console.log(e.target.value + "cat value");
            this.categoryIdSelected = e.target[e.target.selectedIndex].id;
            console.log(this.categoryIdSelected + "id");

        });
    }

    getCategoryIdSelected() {
        console.log(this.categoryIdSelected + "first class");
        return this.categoryIdSelected;
    }

    async listBreeds() {
        const url = "https://api.thecatapi.com/v1/breeds";
        let response = await fetch(url, {
            method: "GET",
            withCredentials: true,
            headers: {
                "X-Auth-Token": "54a5f952-dd2e-4bb4-9d56-55c6ff1fcc23",
                "Content-Type": "application/json"
            }
        });
        let data = await response.json();
        this.breedNames = data.map(eachData => eachData.name);
        this.breedIds = data.map(eachData => eachData.id);
        let breedOptions = document.getElementById("breed");
        for (let i = 0; i < this.breedNames.length; i++) {
            let newOption = new Option(`${this.breedNames[i]}`, `${this.breedNames[i]}`);
            newOption.id = `${this.breedIds[i]}`;
            // console.log(this.breedIds[i] + "BRD ID");
            breedOptions.add(newOption, undefined);
        }

        breedOptions.addEventListener('change', (e) => {
            console.log(e);
            console.log(e.target.value + "target");
            this.breedIdSelected = e.target[e.target.selectedIndex].id;
            // console.log(this.breedIdSelected + "BRD ID SELCTD");

        });

    }

    getBreedIdSelected() {
        console.log(this.breedIdSelected + "first class");
        return this.breedIdSelected;
    }

    // getBreedNameSelected() {
    //     console.log(this.breedNameSelected + " get breedname");
    //     return this.breedNameSelected;
    // }


}

class setCatImagesApiHandler {

    constructor() {
        this.changePage;
        this.page = 0;
        this.FormFill = new LoadCategoriesAndBreed();
        this.firstButtonValue = 0;
        // console.log()
        this.FormFill.listCategories().catch(function (error) {
            console.log(error);
        });

        this.FormFill.listBreeds().catch(function (error) {
            console.log(error);
        });
        this.form = document.getElementById("form").onsubmit = (e) => {
            e.preventDefault();
            // console.log("ONSUBMIT" +.FormFill.categoryIdSelected);
            console.log("submitted!");
            this.setCatImagesOnScreen(this.page).catch(function (error) {
                console.log(error);
            });
        }

    }

    async setCatImagesOnScreen(pageNumber) {

        console.log(pageNumber + "pageNo");
        let div = document.getElementById("picture");
        div.innerHTML = "";

        // let selectedBreedName = this.FormFill.getBreedNameSelected();
        // console.log(selectedBreedName + " get breedname");

        let selectedBreedId = this.FormFill.getBreedIdSelected();
        // console.log(selectedBreedId + "BRD BRD");

        let selectedCategoryId = this.FormFill.getCategoryIdSelected();
        // if(selectedCategoryId == undefined){
        //     selectedCategoryId = 5;
        // }


        let limitValue = document.getElementById("limit");
        let limit = limitValue.value;


        // let typeValue = document.getElementById("type");
        // // let type = typeValue.value;
        // // console.log(type + "lmt");
        // console.log(typeValue + "typeValue");

        let typeValue = document.getElementById("imgType");
        let imgType = typeValue.value;

        let paginationArea = document.getElementById("paginationArea");
        console.log("paginatn area" + paginationArea);
        paginationArea.innerHTML = "";

        let orderValue = document.getElementById("order");
        let order = orderValue.value;


        console.log(selectedCategoryId + " catgry id");
        console.log(imgType + "type");
        // console.log(selectedBreedName + " breed id");
        console.log(order + "ordr");
        console.log(limit + "  limit");

        // const imgUrl = `https://api.thecatapi.com/v1/images/search?order=${order}&category_ids=${selectedCategoryId}&mime_types=${imgType}&breed_ids=${selectedBreedId}`;
        const imgUrl = `https://api.thecatapi.com/v1/images/search?limit=${limit}&order=${order}&category_ids=${selectedCategoryId}&mime_types=${imgType}&breed_ids=${selectedBreedId}&page=${pageNumber}`;

        console.log(imgUrl);
        let response = await fetch(imgUrl, {
            method: "GET",

            headers: {
                "X-Auth-Token": "54a5f952-dd2e-4bb4-9d56-55c6ff1fcc23",
                "Content-Type": "application/json"
            }
        });

        // let headersList = response.headers.page;
        // console.log(response);
        let data = await response.json();
        // console.log(data);
        // console.log(response.headers['pagination-count'] + "last one");
        // let pageCount = response.headers.get('Content-Type');
        // let pageCount = response.headers.get('total_count');
        // let pageCount = response.headers.get('Pagination-Count');
        let pageCount = response.headers.get('Content-Length');
        // console.log(pageCount + "pagecount");
        console.log(response.headers);
        console.log(response.body);
        for (let i = 0; i < data.length; i++) {
            div.innerHTML += `<img src ="${data[i].url}" class="image" height="200px" weight="200px"/>`;
            if (i == 2 || i == 5 | i == 8) {
                div.innerHTML += `</br>`;
            }
        }
        
        let previousButtonArea = document.getElementById("previous");
        previousButtonArea.innerHTML= "";
        previousButtonArea.innerHTML += `<button  id="previousElement" value ="previous" type="button"> << </button>`;

        let previousButton = document.getElementById("previousElement");
        previousButton.addEventListener("click", () => {
            if(this.firstButtonValue != 0){
            this.firstButtonValue -= 10;
            this.setPagination(this.firstButtonValue);
        }
        });

        this.setPagination(this.firstButtonValue);

        
        let nextButtonArea = document.getElementById("next");
        nextButtonArea.innerHTML = "";
        nextButtonArea.innerHTML += `<button  id="nextElement" value ="next" type="button"> >> </button>`;
        let nextButton = document.getElementById("nextElement");
        nextButton.addEventListener("click", () => {
            if(this.firstButtonValue != pageCount){
            this.firstButtonValue += 10;
            this.setPagination(this.firstButtonValue);
            }
        })

        
    }

    async setPagination(firstButtonValue){
        paginationArea.innerHTML = "";
        let j = firstButtonValue;
        let i = j+1;
        let id;
        for( j = j; j < firstButtonValue + 10; j++){
            console.log(j+1 + " j values");
            id = `btn${j+1}`;
            console.log(id+ " ID");
            paginationArea.innerHTML += `<button id="${id}" class="paginateBtn" value =${j+1} type="button">${j+1}</button>`;
            let paginateButton = document.getElementById(id);  
        }

        for(let k = firstButtonValue; k<firstButtonValue + 10; k++){
            id = `btn${k+1}`;
            let paginateButton = document.getElementById(id);
            paginateButton.addEventListener("click", (e) => {
                
                this.setCatImagesOnScreen(e.target.value);  
              
            });
        }

    }

}

window.addEventListener('DOMContentLoaded', function () {
    let handler = new setCatImagesApiHandler();
});









