var firebaseConfig = {
    apiKey: "AIzaSyBFkmspKoi-RDOMZfL-k9__70YIaS7vLn0",
    authDomain: "notedemo-a1e15.firebaseapp.com",
    projectId: "notedemo-a1e15",
    storageBucket: "notedemo-a1e15.appspot.com",
    messagingSenderId: "641128485554",
    appId: "1:641128485554:web:db3794ada96d08b1ea2fab"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const dbRef = firebase.database()

console.log("Welcome to notes app. This is app.js");
showNotes();

// If user adds a note, add it to the localStorage
let addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", function(e) {
  let addTxt = document.getElementById("addTxt");
  let notes = localStorage.getItem("notes");
  if (notes == null) {
    notesObj = [];
  } else {
    notesObj = JSON.parse(notes);
  }
  notesObj.push(addTxt.value);
  localStorage.setItem("notes", JSON.stringify(notesObj));
  addTxt.value = "";
//   console.log(notesObj);
  showNotes();
});

// Function to show elements from localStorage
function showNotes() {
  let notes = localStorage.getItem("notes");
  if (notes == null) {
    notesObj = [];
  } else {
    notesObj = JSON.parse(notes);
  }
  let html = "";
  notesObj.forEach(function(element, index) {
    html += `
            <div class="noteCard my-2 mx-2 card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">Note ${index + 1}</h5>
                        <p class="card-text"> ${element}</p>
                        <button id="${index}"onclick="deleteNote(this.id)" class="btn btn-primary">Delete Note</button>
                    </div>
                </div>`;
  });
  let notesElm = document.getElementById("notes");
  if (notesObj.length != 0) {
    notesElm.innerHTML = html;
  } else {
    notesElm.innerHTML = `Nothing to show! Use "Add a Note" section above to add notes.`;
  }
}

// Function to delete a note
function deleteNote(index) {
//   console.log("I am deleting", index);

  let notes = localStorage.getItem("notes");
  if (notes == null) {
    notesObj = [];
  } else {
    notesObj = JSON.parse(notes);
  }

  notesObj.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notesObj));
  showNotes();
}


let search = document.getElementById('searchTxt');
search.addEventListener("input", function(){

    let inputVal = search.value.toLowerCase();
    // console.log('Input event fired!', inputVal);
    let noteCards = document.getElementsByClassName('noteCard');
    Array.from(noteCards).forEach(function(element){
        let cardTxt = element.getElementsByTagName("p")[0].innerText;
        if(cardTxt.includes(inputVal)){
            element.style.display = "block";
        }
        else{
            element.style.display = "none";
        }
        // console.log(cardTxt);
    })
})

async function saveNoteWithTitle(title, content) {
    const uid = localStorage.getItem("uid")
    const userNoteRef = dbRef.ref('notes/' + uid)
    const noteKey = userNoteRef.push().key
    let upd = { ['/notes/' + uid + noteKey]: { title, content } }

    return await dbRef.update(upd)
}

async function saveNoteToFirebase(content) {
    const uid = localStorage.getItem("uid")
    const userNoteRef = dbRef.ref('notes/' + uid)
    let notes = await getNotesForThisUser()
    return await userNoteRef.set({
        ...notes,
        [Date.now()]: content
    })
}

async function getNotesForThisUser() {
    const uid = localStorage.getItem("uid")
    const userNotesRef = dbRef.ref('notes/' + uid)
    const ss = await userNotesRef.get()
    if (ss.exists())
        return ss.val()
    else return {}

}

saveNoteToFirebase("This note was created at " + new Date().toISOString())
    .then(async res => {
        let notes = await getNotesForThisUser()
        console.log(notes)
    })
    .catch(err => console.log(err))

/*
TODO: Further Features:
1. Add Title
2. Mark a note as Important
3. Separate notes by user
4. Sync and host to web server 
*/ 