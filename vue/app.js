window.addEventListener("load", () => {
  //---------------------------------------------------------
  //[for deleting all the users..]
  //--------------------------------------------------
  //---------------------------------------------------------
  //
  //------------------------------------------------
  //------------------------------------------------
  var news_title = document.querySelector(".news_title");
  var publicchatsapp_idApp = document.querySelector("div#app");
  publicchatsapp_idApp.style.display = "block";
  new Vue({
    el: "#app",
    data: {
      button_conditions: {
        loading: false,
      },
      present_user: false,
      myName: "",
      changeName: "Go",
      changePlaceholder: "Username..",
      messagePlaceholder: "Write your message..",
      replace_unique_name_typing: true,
      addMassageText: "",
      publicMessageFromWeb: [],
      timeDate: "",
      seeMe: true,
    },
    methods: {
      log_in(e) {
        if (e != "" && e.length > 10) {
          this.button_conditions.loading = true;
          db.collection("users")
            .where("name", "==", e)
            .get()
            .then((data) => {
              if (data.docs.length == 0) {
                db.collection("users")
                  .add({
                    name: e,
                  })
                  .then(() => {
                    //same(onSnapshot: publicMessagesDatabase,
                    // except: this.present_user) starts..
                    //---------------------------------------------
                    this.timeDate = new Date();
                    db.collection("publicMessagesDatabase")
                      .add({
                        userName: e,
                        publicMessage: "Welcome to Puclic Chats",
                        newDate: this.timeDate,
                      })
                      .then(() => {
                        db.collection("publicMessagesDatabase")
                          .orderBy("newDate", "asc")
                          .onSnapshot((data) => {
                            data.docChanges().forEach((docChange) => {
                              let changeValue = docChange.doc.data();
                              if (docChange.type == "added") {
                                this.publicMessageFromWeb.unshift(changeValue);
                              }
                            });
                            this.replace_unique_name_typing = false;
                            this.button_conditions.loading = false;
                            this.present_user = true;
                            news_title.remove();
                          });
                      });
                    //----------------------------------------------
                  });
              } else {
                //same(onSnapshot: publicMessagesDatabase,
                // except: this.present_user) starts..
                //---------------------------------------------
                db.collection("publicMessagesDatabase")
                  .orderBy("newDate", "asc")
                  .onSnapshot((data) => {
                    data.docChanges().forEach((docChange) => {
                      let changeValue = docChange.doc.data();
                      if (docChange.type == "added") {
                        this.publicMessageFromWeb.unshift(changeValue);
                      }
                    });
                    this.replace_unique_name_typing = false;
                    this.button_conditions.loading = false;
                    this.present_user = false;
                    news_title.remove();
                  });
                //----------------------------------------------
              }
            });
        } else {
          alert("Type minimum 11 carecters");
        }
      },
      addMessage(e) {
        if (this.addMassageText != "") {
          this.button_conditions.loading = true;
          this.timeDate = new Date();
          db.collection("publicMessagesDatabase")
            .add({
              userName: e,
              publicMessage: this.addMassageText,
              newDate: this.timeDate,
            })
            .then(() => {
              this.addMassageText = "";
              this.button_conditions.loading = false;
            });
        }
      },
    },
  });
});
