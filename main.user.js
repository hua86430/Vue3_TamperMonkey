// ==UserScript==
// @name         Vue 3 TamperMonkey
// @version      1.3.56
// @author       TWSC_Jack
// @description 各種省時間的小東西
// @namespace ***
// @license ***

// Leo
// @include        /^http://leo.*/
// SBO
// @include      /^https?://account.localdev.net/register*
// @include      /^https?://account\.(.*sbo.*|.*top.*)\.com/register*
// @include      /^https?://account\.sbo\.top/register*/
// @include      /^https?://(www|m|play)\.(.*sbo.*|.*top.*).*\.com/?$/
// @include      /^https?://(www|m|play)\.(.*sbo.*|.*top.*).*\.com/?\?/
// @include      /^https?://(www|m|play)\.sbo\.top/?$/
// @include      /^https?://(www|m|play)\.sbo\.top/?\?/
// @include      /^https?://(www|m|play)\.sbo\.top/?\?/

// Database
// @include        /^http?://dba-(stg|sb-prod).coreop.net.*/

// DragonBallz
// @include        /^http://dragonballz.coreop.net.*/

// TrexDino
// @include        /^http://(stg.dino-pay|internal.drakonas).co/login.*/

// @updateURL https://github.com/hua86430/Vue3_TamperMonkey/raw/main/main.user.js
// @downloadURL https://github.com/hua86430/Vue3_TamperMonkey/raw/main/main.user.js
// @require https://greasyfork.org/scripts/7847-script-updater-userscripts-org/code/Script%20Updater%20(userscriptsorg).js?version=34757
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.31/dist/vue.global.prod.min.js
// ==/UserScript==

(function() {
  "use strict";
  const _sfc_main$1 = {
    setup(__props) {
      const profile = Vue.reactive({
        FirstName: "_____YOUR_FIRSTNAME_____",
        LastName: "_____YOUR_LASTNAME_____",
        ID: "_____YOUR_ID_____",
        Password: "_____YOUR_PASSWORD_____",
        SimplePassword: "_____YOUR_SIMPLE_PASSWORD_____",
        AccountName: "",
        AccountNameWithT: "",
        AccountNameWithNumber: "",
        AccountNameSortWithT: "",
        UserNameInput: "",
        PasswordInput: ""
      });
      const GenerateProfile = () => {
        const FN = profile.FirstName;
        const LN = profile.LastName;
        const ID = profile.ID;
        profile.AccountName = `${FN}${LN}`;
        profile.AccountNameWithT = `t${FN}${LN}`;
        profile.AccountNameWithNumber = `${FN}.${LN}${ID}`;
        profile.AccountNameSortWithT = `t${FN}`;
      };
      const ValidateUrl = (site) => {
        const { URL } = document;
        return URL.includes(site);
      };
      const ElementById = (id) => {
        return document.getElementById(id);
      };
      const ElementByClass = (className) => {
        return document.querySelector(`${className}`);
      };
      const DragonBallz = () => {
        profile.UserNameInput = ElementByClass('input[name="username"]');
        profile.PasswordInput = ElementByClass('input[name="password"]');
        if (profile.UserNameInput) {
          profile.UserNameInput.value = profile.AccountNameWithNumber;
          profile.PasswordInput.value = profile.Password;
          document.querySelector(".form-signin").submit();
        } else {
          const ProjectInput = ElementByClass('input[type="search"]');
          const SearchInput = ElementById("colFormLabel");
          ProjectInput.focus();
          ElementByClass('input[type="search"]').addEventListener("blur", (e) => {
            SearchInput.focus();
          });
        }
      };
      const Database = () => {
        const LoginButton = ElementById("login");
        profile.UserNameInput = ElementById("username");
        profile.PasswordInput = ElementById("password");
        if (LoginButton) {
          profile.UserNameInput.value = profile.AccountNameWithNumber;
          profile.PasswordInput.value = profile.Password;
          LoginButton.click();
          return;
        }
        if (profile.PasswordInput) {
          profile.PasswordInput.focus();
        }
        if (ValidateUrl("Query")) {
          const DBList = ElementById("searchDB");
          const TableList = ElementById("searchTable");
          const InsertButton = ElementById("insert");
          const SubmitButton = ElementById("btnSubmit");
          document.addEventListener("keydown", (e) => {
            if (e.ctrlKey) {
              switch (e.key) {
                case ",":
                  DBList.focus();
                  break;
                case ".":
                  TableList.focus();
                  break;
              }
            }
          });
          DBList.focus();
          setTimeout(() => {
          }, 2e3);
          DBList.addEventListener("focus", () => {
            DBList.value = "";
            TableList.value = "";
          });
          TableList.addEventListener("focus", () => TableList.value = "");
          DBList.addEventListener("change", (e) => {
            TableList.focus();
            TableList.value = "";
          });
          TableList.addEventListener("change", () => {
            if (DBList.value && TableList.value) {
              setTimeout(() => {
                TableList.blur();
                InsertButton.click();
                SubmitButton.click();
              }, 350);
            }
          });
        }
      };
      const TrexDinoLogin = async (isStaging) => {
        const LoginData = {
          Username: profile.AccountNameSortWithT,
          Password: isStaging ? profile.SimplePassword : profile.Password,
          authCode: isStaging ? "123" : ElementById("AuthCode").value
        };
        let result = await fetch("/api/v1/login", {
          method: "post",
          body: JSON.stringify(LoginData),
          headers: {
            "content-type": "application/json"
          }
        });
        result = await result.json();
        if (result.status === 1) {
          localStorage.setItem("t", result.data.token);
          localStorage.setItem("ro", result.data.roles);
          localStorage.setItem("name", result.data.name);
          localStorage.setItem("group", result.data.group);
          localStorage.setItem("mc", result.data.merchantCode);
          location.href = "/welcome";
        }
      };
      const TrexDino = async () => {
        const WarningText = "!!!!! Just Need To Input Auth Code !!!!!";
        ElementById("UserName").setAttribute("placeholder", WarningText);
        ElementById("loginPassword").setAttribute("placeholder", WarningText);
        const isStaging = ValidateUrl("dino-pay");
        const AuthCodeInput = ElementById("AuthCode");
        await TrexDinoLogin(isStaging);
        if (isStaging)
          return;
        AuthCodeInput.focus();
        AuthCodeInput.addEventListener("keyup", async (e) => {
          if (AuthCodeInput.value.length === 6) {
            await TrexDinoLogin(isStaging);
          }
        });
      };
      const Leo = () => {
        ElementById("txtUsername").value = profile.AccountNameWithT;
        ElementById("txtPassword").value = profile.Password;
        ElementById("btnLogin").click();
      };
      const selectCurrentSite = () => {
        switch (true) {
          case ValidateUrl("dragonballz"):
            DragonBallz();
            break;
          case ValidateUrl("dba"):
            Database();
            break;
          case ValidateUrl("leo"):
            Leo();
            break;
          case ValidateUrl("drakonas"):
          case ValidateUrl("dino-pay"):
            TrexDino();
            break;
        }
      };
      Vue.onMounted(() => {
        console.log("AutoLogin Start");
        GenerateProfile();
        selectCurrentSite();
      });
      return () => {
      };
    }
  };
  const _sfc_main = {
    setup(__props) {
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("div", null, [
          Vue.createVNode(_sfc_main$1)
        ]);
      };
    }
  };
  function CreateVue(app, container = "#TamperMonkeyContainer") {
    Vue.createApp(app).mount(container);
  }
  function init() {
    CreateVue(_sfc_main);
  }
  var global = {
    init
  };
  var pages = {
    global
  };
  function initRouter() {
    const Container = document.createElement("div");
    Container.id = "TamperMonkeyContainer";
    document.body.append(Container);
    pages.global.init();
    if (location.href.indexOf("prod") !== -1)
      ;
  }
  initRouter();
})();
