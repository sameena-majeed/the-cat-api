
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

        for (let i = 0; i < this.categoryNames.length; i++) {
            let newOption = new Option(`${this.categoryNames[i]}`, `${this.categoryNames[i]}`);
            newOption.id = `${this.categoryIds[i]}`;
            categoryOptions.add(newOption, undefined);
        }
        categoryOptions.addEventListener('change', (e) => {
            this.categoryIdSelected = e.target[e.target.selectedIndex].id;
        });
    }

    getCategoryIdSelected() {
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
            breedOptions.add(newOption, undefined);
        }
        breedOptions.addEventListener('change', (e) => {
            this.breedIdSelected = e.target[e.target.selectedIndex].id;
        });
    }

    getBreedIdSelected() {
        return this.breedIdSelected;
    }
}

class setCatImagesApiHandler {
    constructor() {
        this.changePage;
        this.page = 0;
        this.FormFill = new LoadCategoriesAndBreed();
        this.firstButtonValue = 0;
        this.FormFill.listCategories().catch(function (error) {
            console.log(error);
        });
        this.FormFill.listBreeds().catch(function (error) {
            console.log(error);
        });
        this.form = document.getElementById("form").onsubmit = (e) => {
            e.preventDefault();
            this.getCatImagesFromAPI(this.page).catch(function (error) {
                console.log(error);
            });
        }
    }

    getQueryStrings() {
        let selectedBreedId = this.FormFill.getBreedIdSelected();
        let selectedCategoryId = this.FormFill.getCategoryIdSelected();
        let limitValue = document.getElementById("limit");
        let limit = limitValue.value;
        let typeValue = document.getElementById("imgType");
        let imgType = typeValue.value;
        let orderValue = document.getElementById("order");
        let order = orderValue.value;

        return {
            selectedBreedId,
            selectedCategoryId,
            limit,
            imgType,
            order
        }
    }

    async getCatImagesFromAPI(pageNumber) {

        let div = document.getElementById("picture");
        let paginationArea = document.getElementById("paginationArea");

        div.innerHTML = "";
        paginationArea.innerHTML = "";

        let querySTrings = this.getQueryStrings();
        let limit = querySTrings.limit;
        let order = querySTrings.order;
        let imgType = querySTrings.imgType;
        let selectedCategoryId = querySTrings.selectedCategoryId;
        let selectedBreedId = querySTrings.selectedBreedId;

        if (selectedCategoryId != "" && selectedBreedId != "") {
            div.innerHTML = `<p>NO RESULT FOUND! <p></br> <p> Try either category or breed. Not both.`;
        }

        const imgUrl = `https://api.thecatapi.com/v1/images/search?limit=${limit}&order=${order}&category_ids=${selectedCategoryId}&mime_types=${imgType}&breed_ids=${selectedBreedId}&page=${pageNumber}`;
        console.log(imgUrl);
        let response = await fetch(imgUrl, {
            method: "GET",
            headers: {
                "X-Auth-Token": "54a5f952-dd2e-4bb4-9d56-55c6ff1fcc23",
                "Content-Type": "application/json"
            }
        });
        let data = await response.json();

        if (data != "") {
            let pageCount = response.headers.get('Content-Length');

            this.setImagesAndPagination(data, pageCount, div);
        } else {
            div.innerHTML = `<p>NO RESULT FOUND! <p>`;
            return;
        }
    }

    async setImagesAndPagination(data, pageCount, div) {

        for (let i = 0; i < data.length; i++) {
            div.innerHTML += `<img src ="${data[i].url}" class="image" height="200px" weight="200px"/>`;
            if (i == 2 || i == 5 | i == 8) {
                div.innerHTML += `</br>`;
            }
        }

        let previousButtonArea = document.getElementById("previous");
        previousButtonArea.innerHTML = "";
        previousButtonArea.innerHTML += `<button  id="previousElement" value ="previous" type="button"> << </button>`;
        let previousButton = document.getElementById("previousElement");
        previousButton.addEventListener("click", () => {
            if (this.firstButtonValue != 0) {
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
            if (this.firstButtonValue != pageCount) {
                this.firstButtonValue += 10;
                this.setPagination(this.firstButtonValue);
            }
        })
    }


    async setPagination(firstButtonValue) {
        paginationArea.innerHTML = "";
        let j = firstButtonValue;
        let i = j + 1;
        let id;
        for (j = j; j < firstButtonValue + 10; j++) {
            id = `btn${j + 1}`;
            paginationArea.innerHTML += `<button id="${id}" class="paginateBtn" value =${j + 1} type="button">${j + 1}</button>`;
        }

        for (let k = firstButtonValue; k < firstButtonValue + 10; k++) {
            id = `btn${k + 1}`;
            let paginateButton = document.getElementById(id);
            paginateButton.addEventListener("click", (e) => {
                this.getCatImagesFromAPI(e.target.value);
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', function () {
    let handler = new setCatImagesApiHandler();
});









