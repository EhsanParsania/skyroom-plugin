// ==UserScript==
// @name         Maktab47 - ReactJS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://onlinebootcamp.maktabsharif.ir/ch/maktab47-jsreactjs-public
// @icon         https://www.google.com/s2/favicons?domain=atomicobject.com
// @grant        none
// ==/UserScript==


(function () {
  document.body.onload = function () {
    
    //raise accessability:
    new MutationObserver(() => {
      try {
        document.querySelectorAll(".role-member.checked").forEach((elem) => {
          elem.nextSibling.nextSibling.click();
          document
            .querySelector(".col.dialog.dialog-warning")
            .querySelectorAll("button")[1]
            .click();
        });
      } catch (error) {
        console.error("ERROR:", error);
      }
    }).observe(document.querySelector("#users-role-1.user-role-group"), {
      childList: true,
    });

    //load images
    const getPictures = new Promise((resolve, reject) => {

      // get image from server (in here i get classmate images from mockapi)
      let req = new XMLHttpRequest();
      req.open("GET", "https://607458b4066e7e0017e79ac4.mockapi.io/user");
      req.send();
      req.onload = () => {
        if (req.status <= 200) {
          resolve(JSON.parse(req.responseText));
        } else {
          reject("cannot read successfully");
        }
      };
    });
    
    //voice options:
    document.querySelector(".room-nav").querySelector(".box").innerHTML =
      "<div id='speakers'></div>";

    new MutationObserver(function (records) {
      getPictures.then((students) => {
        records.forEach((rec) => {
          let row = rec.addedNodes[0];
          if (row) {
            if (row.firstChild.firstChild) row.firstChild.firstChild.remove();
            students.forEach((person) => {
              if (
                row.querySelector(".user-nickname-box").firstChild.title ==
                person.name
              ) {
                row.firstChild.style.backgroundImage = `url(${person.url})`;
                row.firstChild.personId = `p${person.id}`;
                if (!document.querySelector(`p${person.id}`)) {
                  let pictureElement = row.firstChild.cloneNode(true);
                  pictureElement.id = `p${person.id}`;
                  pictureElement.className = "hidden-div";
                  pictureElement.style.backgroundImage = `url('${person.url}')`;
                  document
                    .querySelector("#speakers")
                    .appendChild(pictureElement);
                }
                row.querySelector(".mic").classList.contains("off")
                  ? document
                    .querySelector(`#p${person.id}`)
                    .classList.add("hidden-div")
                  : document
                    .querySelector(`#p${person.id}`)
                    .classList.remove("hidden-div");
                new MutationObserver(loadSpeaker).observe(
                  row.querySelector(".mic"),
                  { attributes: true }
                );
                if (person.type === "t")
                  row
                    .querySelector(".user-nickname-box")
                    .firstChild.classList.add("TEACHER1");
                if (person.type === "a")
                  row
                    .querySelector(".user-nickname-box")
                    .firstChild.classList.add("TEACHER2");
              }
            });
          }
        });
      });
    }).observe(document.querySelector("#users-role-3"), { childList: true });
  };
  const loadSpeaker = function (mutationList) {
    mutationList.forEach((record) => {
      let id =
        record.target.parentNode.previousSibling.previousSibling.personId;
      if (record.target.classList.contains("off"))
        document.querySelector(`#${id}`).classList.add("hidden-div");

      if (!record.target.classList.contains("off"))
        document.querySelector(`#${id}`).classList.remove("hidden-div");

      if (record.target.classList.contains("active-action"))
        document.querySelector(`#${id}`).classList.add("speaking");

      if (!record.target.classList.contains("active-action"))
        document.querySelector(`#${id}`).classList.remove("speaking");
    });
  };
  //adding needed styles
  const style = document.createElement("style");
  style.innerHTML = `
		.col.toast.toast-error {
		  display: none !important;
		}
	
		.user-icon {
		  z-index: 9;
		  height: 22px;
		  position: relative;
		  right: 0;
		  margin-left: 5px;
		  transition: all ease 0.2s;
		  transition-delay: 0.3s;
		  border-radius: 50%;
		  background-size: cover;
		  top: 0px !important;
		}
		.TEACHER1 {
		  color: #ffc300;
		}
		.TEACHER2 {
		  color: #6078ff;
		}
		div#speakers {
		  height: 100%;
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  justify-content: flex-end;
		  padding: 0 10px;
		}
		#speakers div {
		  width: 40px;
		  height: 40px;
		  background-size: cover;
		  border-radius: 50%;
		  margin: 0 5px;
		  box-sizing: border-box;
		  transition: all 0.2s ease;
		  transition-delay: 0.1s;
		  border: 1px solid #000;
		}
		#speakers div:hover {
    	transform: scale(3);
    	z-index: 12;
    	border-radius: 5px;
		}
		.hidden-div {
		  display: none;
		}
		.speaking {
		  animation: speaking 2s infinite;
		}
		@keyframes speaking {
		  0%,
		  100% {
		    box-shadow: 0 0 5px 0px #0e5dff;
		  }
		  50% {
		    box-shadow: 0 0 5px 5px #0e5dff;
		  }
		}
  `;
  document.body.appendChild(style);
})();
