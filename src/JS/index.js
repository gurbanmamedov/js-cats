axios.defaults.baseURL = "https://api.thecatapi.com/v1";
const API_KEY =
  "live_Mtzyzb9Ds3LjnvYwkJYezLKbUDCPTuAjy6qnQdFNrZqBin8FcgGfaQsvUQyHsw5v";
axios.defaults.headers.common["x-api-key"] = API_KEY;

const fetchBreeds = async () => {
  showLoader();
  try {
    const { data } = await axios.get("/breeds");
    return data.map((breed) => ({ id: breed.id, name: breed.name }));
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  } finally {
    hideLoader();
  }
};

const fetchCatByBreed = async (breedId) => {
  showLoader();
  try {
    const { data } = await axios.get("/images/search", {
      params: {
        breed_ids: breedId,
      },
    });
    return data[0];
  } catch (error) {
    console.error("Error fetching cat by breed:", error);
    throw error;
  } finally {
    hideLoader();
  }
};

const breedSelect = document.querySelector(".breed-select");
const loader = document.querySelector(".loader");
const catInfo = document.querySelector(".cat-info");
const catImage = document.querySelector(".cat-image");
const catName = document.querySelector(".cat-name");
const catDescription = document.querySelector(".cat-description");
const catTemperament = document.querySelector(".cat-temperament");
const error = document.querySelector(".error");

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

function showError() {
  error.style.display = "block";
}

function updateCatInfo(cat) {
  if (cat.breeds && cat.breeds.length > 0) {
    catImage.src = cat.url;
    catName.textContent = `Name: ${cat.breeds[0].name}`;
    catDescription.textContent = `Description: ${cat.breeds[0].description}`;
    catTemperament.textContent = `Temperament: ${cat.breeds[0].temperament}`;
  } else {
    catImage.src = "";
    catName.textContent = "";
    catDescription.textContent = "";
    catTemperament.textContent = "";
  }
  catInfo.style.display = "block";
}

breedSelect.addEventListener("change", async () => {
  const selectedBreedId = breedSelect.value;
  loader.style.display = "block";
  catInfo.style.display = "none";
  try {
    const cat = await fetchCatByBreed(selectedBreedId);
    updateCatInfo(cat);
  } catch (error) {
    showError();
  } finally {
    loader.style.display = "none";
  }
});

window.addEventListener("load", async () => {
  try {
    const breeds = await fetchBreeds();
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (err) {
    showError();
  } finally {
    loader.style.display = "none";
  }
});
