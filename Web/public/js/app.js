// The Auth0 client, initialized in configureClient()
let auth0 = null;
let countHeader=1;

lastJsonAction = null;
lastJsonREAction = null;
typeOfLastAction = null;
 
userGithubConnected = false;
userGoogleConnected = false;

/**
 * Starts the authentication flow
 */
const login = async (targetUrl) => {
  try {
    console.log("Logging in", targetUrl);

    const options = {
      redirect_uri: window.location.origin
    };

    if (targetUrl) {
      options.appState = { targetUrl };
    }

    await auth0.loginWithRedirect(options);
  } catch (err) {
    console.log("Log in failed", err);
  }
};

/**
 * Executes the logout flow
 */
const logout = () => {
  try {
    console.log("Logging out");
    auth0.logout({
      returnTo: window.location.origin
    });
  } catch (err) {
    console.log("Log out failed", err);
  }
};

/**
 * Retrieves the auth configuration from the server
 */
const fetchAuthConfig = () => fetch("/auth_config.json");

/**
 * Initializes the Auth0 client
 */
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId
  });
};

/**
 * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */
const requireAuth = async (fn, targetUrl) => {
  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    return fn();
  }

  return login(targetUrl);
};

//Hide BUTTON WIDGET
//* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict */
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}

// Will run when page finishes loading
window.onload = async () => {
  await configureClient();

  // If unable to parse the history hash, default to the root URL
  if (!showContentFromUrl(window.location.pathname)) {
    showContentFromUrl("/");
    window.history.replaceState({ url: "/" }, {}, "/");
  }

  const bodyElement = document.getElementsByTagName("body")[0];

  // Listen out for clicks on any hyperlink that navigates to a #/ URL
  bodyElement.addEventListener("click", (e) => {
    if (isRouteLink(e.target)) {
      const url = e.target.getAttribute("href");

      if (showContentFromUrl(url)) {
        e.preventDefault();
        window.history.pushState({ url }, {}, url);
      }
    }
  });

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    console.log("> User is authenticated");
    window.history.replaceState({}, document.title, window.location.pathname);
    updateUI();
    return;
  }

  console.log("> User not authenticated");

  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");

  if (shouldParseResult) {
    console.log("> Parsing redirect");
    try {
      const result = await auth0.handleRedirectCallback();

      if (result.appState && result.appState.targetUrl) {
        showContentFromUrl(result.appState.targetUrl);
      }

      console.log("Logged in!");

      requestAPI("get", null, "/debug/test_api_call" )
      .then(async function (response) {
        const b = await response.text()
        console.log("API CALL SUCCESS: " + b)
      });

    } catch (err) {
      console.log("Error parsing redirect:", err);
    }

    window.history.replaceState({}, document.title, "/");
  }

  updateUI();
};

async function requestAPI(methods, objJson, route){
  const a = await auth0.getIdTokenClaims()
  let newObjectJson = {};
  let postHeaders = {};

  if(methods === "post"){
    newObjectJson = {body: objJson};
    postHeaders = {'Accept': 'application/json', 'Content-Type': 'application/json'}
    console.log("TESTTTTTTT =  " +JSON.stringify(newObjectJson))
  }
  let argument = {
    method: methods,
    headers: {
      'Authorization': `Bearer ${a.__raw}`,
      ...postHeaders
    },...newObjectJson
    
  }
  console.log("TESTTTTTTT222222 =  " + JSON.stringify(argument))
  return fetch('http://localhost:3000'+route, argument)

}
///GET JSON FROM FORM
function handleSubmit(event) {
  event.preventDefault();

  const data = new FormData(event.target);

  const value = Object.fromEntries(data.entries());

  value.topics = data.getAll("topics");

  //Ajouter dans une route 
  //console.log({ value });
  console.log("lastJsonAction : " + JSON.stringify(lastJsonAction) );
  console.log("value : " + JSON.stringify(value));
  //verifie si le JSON ACTION contion le même id que la reaction
  if(contains(value, "typeform", "action")){
    lastJsonAction = value;
    console.log("lastJsonAction : " + JSON.stringify(lastJsonAction) );
  }

  if(contains(value, "typeform", "reaction")){
    lastJsonREAction = value;
    console.log("lastJsonREAction : " + JSON.stringify(lastJsonREAction) );

    const mergedObject = 
    {
      action: lastJsonAction,
      reaction: lastJsonREAction,
    };
    console.log("mergedObject : " + JSON.stringify(mergedObject) );
    let newMergeObj = JSON.stringify(mergedObject);
    requestAPI("post", newMergeObj, "/workflows/add");
  }
}

function contains(arr, key, val) {
    for (let key in arr) {
     if (arr[key] === val) {
        return true;
      }      
    }
    return false;
}

function formEvent(){
  const form = document.querySelectorAll("form");
  form.forEach(form => {
    form.addEventListener("submit", handleSubmit);
  });
}

function myAlert(text) {
  alert(text);
}

$(document).ready(function(){
  
  $('#create').click(function(){
    // clone
    var todo = $('#todo').find('li').first().clone();
    // insert @bottom
    $('#todo').append(todo);
  });
  
  $('#listOfWorkflow').on('click', '.deletelist', function(e){
     $(e.currentTarget).closest('li').remove();
  });
  
  // $('.delete').click(function(e){
  //   // target's li, remove
  //   $(e.currentTarget).closest('li').remove();
  // });
  
});
// Make the DIV element draggable:
//dragElement(document.getElementById("mybox"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "meteo")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "meteo").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}



function dragDrop(mydiv){
  dragElement(document.getElementById(mydiv));

  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}



