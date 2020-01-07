function updateList() {
  var filelist = document.getElementById('fileElem').files
  console.log(filelist)
  filelist = Array.from(filelist).map( (val, index) => { return val['name']; } )
  document.getElementById("file-list").innerHTML = `<div class="note"> Uploaded files: <br />` + filelist.toString().replace(/\,/g, ', <br />') + `</div>`
}

function handleFiles() {
  var files = document.getElementById('fileElem').files
  var user_email = document.getElementById("user-email").value 
  document.getElementById("temporary").innerHTML = `        
  <div class="showbox">        
  <div class="loader">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
          </svg>
        </div></div>`;
  Array.from(files).forEach(file => { uploadFile(file, user_email) });
  document.getElementById("content").innerHTML = "Your files have been sucessfully uploaded. <br /> <br /> They will be delivered to <b>" + user_email + "</b> within a few minutes. <br/ >";
  document.getElementById("temporary").innerHTML = `<div class="showbox"><div class="loader"> <img src="images/ok.png" id="smallershowbox"></img></div></div>`;
  // files.forEach(previewFile)
}


// // ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area")

  // Prevent default drag behaviors
  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
  })

  // Highlight drop area when item is dragged over it
  ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })

  ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

function uploadFile(file, user_email) {
  var elements = tagify.value;

  var languages = ""
  var email = user_email
  var language = ""
  var dictionary = { "Afrikaans" : "afr",
  "Amharic" : "amh",
  "Arabic" : "ara",
  "Assamese" : "asm",
  "Azerbaijani" : "aze",
  "Azerbaijani - Cyrilic" : "aze_cyrl",
  "Belarusian" : "bel",
  "Bengali" : "ben",
  "Tibetan" : "bod",
  "Bosnian" : "bos",
  "Breton" : "bre",
  "Bulgarian" : "bul",
  "Catalan ; Valencian" : "cat",
  "Cebuano" : "ceb",
  "Czech" : "ces",
  "Chinese simplified" : "chi_sim",
  "Chinese traditional" : "chi_tra",
  "Cherokee" : "chr",
  "Welsh" : "cym",
  "Danish" : "dan",
  "German" : "deu",
  "Dzongkha" : "dzo",
  "Modern Greek" : "ell",
  "English" : "eng",
  "Middle English" : "enm",
  "Esperanto" : "epo",
  "Mathematics" : "equ",
  "Estonian" : "est",
  "Basque" : "eus",
  "Persian" : "fas",
  "Finnish" : "fin",
  "French" : "fra",
  "Frankish" : "frk",
  "Middle French" : "frm",
  "Irish" : "gle",
  "Galician" : "glg",
  "Ancient Greek" : "grc",
  "Gujarati" : "guj",
  "Haitian Creole" : "hat",
  "Hebrew" : "heb",
  "Hindi" : "hin",
  "Croatian" : "hrv",
  "Hungarian" : "hun",
  "Inuktitut" : "iku",
  "Indonesian" : "ind",
  "Icelandic" : "isl",
  "Italian" : "ita",
  "Old Italian" : "ita_old",
  "Javanese" : "jav",
  "Japanese" : "jpn",
  "Kannada" : "kan",
  "Georgian" : "kat",
  "Old Georgian" : "kat_old",
  "Kazakh" : "kaz",
  "Central Khmer" : "khm",
  "Kirghiz ; Kyrgyz" : "kir",
  "Kurdish Kurmanji" : "kmr",
  "Korean" : "kor",
  "Korean vertical" : "kor_vert",
  "Kurdish" : "kur",
  "Lao" : "lao",
  "Latin" : "lat",
  "Latvian" : "lav",
  "Lithuanian" : "lit",
  "Luxembourgish" : "ltz",
  "Malayalam" : "mal",
  "Marathi" : "mar",
  "Macedonian" : "mkd",
  "Maltese" : "mlt",
  "Mongolian" : "mon",
  "Maori" : "mri",
  "Malay" : "msa",
  "Burmese" : "mya",
  "Nepali" : "nep",
  "Dutch ; Flemish" : "nld",
  "Norwegian" : "nor",
  "Modern Occitan" : "oci",
  "Oriya" : "ori",
  "Panjabi ; Punjabi" : "pan",
  "Polish" : "pol",
  "Portuguese" : "por",
  "Pushto ; Pashto" : "pus",
  "Quechua" : "que",
  "Romanian ; Moldavian ; Moldovan" : "ron",
  "Russian" : "rus",
  "Sanskrit" : "san",
  "Sinhala ; Sinhalese" : "sin",
  "Slovak" : "slk",
  "Slovenian" : "slv",
  "Sindhi" : "snd",
  "Spanish ; Castilian" : "spa",
  "Old Spanish ; Old Castilian" : "spa_old",
  "Albanian" : "sqi",
  "Serbian" : "srp",
  "Serbian - Latin" : "srp_latn",
  "Sundanese" : "sun",
  "Swahili" : "swa",
  "Swedish" : "swe",
  "Syriac" : "syr",
  "Tamil" : "tam",
  "Tatar" : "tat",
  "Telugu" : "tel",
  "Tajik" : "tgk",
  "Tagalog" : "tgl",
  "Thai" : "tha",
  "Tigrinya" : "tir",
  "Tonga" : "ton",
  "Turkish" : "tur",
  "Uighur ; Uyghur" : "uig",
  "Ukrainian" : "ukr",
  "Urdu" : "urd",
  "Uzbek" : "uzb",
  "Uzbek - Cyrilic" : "uzb_cyrl",
  "Vietnamese" : "vie",
  "Yiddish" : "yid",
  "Yoruba" : "yor" }
  for (var i = 0, element; element = elements[i++];) {
    language = element.value
    languages += dictionary[language] + " "
  }
  languages = languages.trim()
  console.log(languages)
  var url = 'http://localhost:3000/upload'

  var formData = new FormData()
  formData.append('mail', email)
  formData.append('languages', languages)
  formData.append('pdf', file)
  axios.post('/upload', formData, { headers: { 'content-type': 'multipart/form-data' } })
    .then(res => {
      console.log(res);
    }).catch(err => {
      console.log('err');
    })
}