import { useEffect, useState, useCallback, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import TranslateIcon from "@mui/icons-material/Translate";
import { IconButton, Menu, MenuItem } from "@mui/material";
import StyledTooltip from "./StyledTooltip";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", flag: "🇧🇩" },
  { code: "ta", label: "Tamil", flag: "🇮🇳" },
  { code: "ne", label: "Nepali", flag: "🇳🇵" },
  { code: "si", label: "Sinhala", flag: "🇱🇰" },
  { code: "ur", label: "Urdu", flag: "🇵🇰" },
  { code: "dz", label: "Dzongkha", flag: "🇧🇹" },
  { code: "ps", label: "Pashto", flag: "🇦🇫" },
  { code: "zh-CN", label: "Chinese (Simplified)", flag: "🇨🇳" },
];

const Translate = () => {
  const [language, setLanguage] = useState(() => "en");
  const [isTranslateLoaded, setIsTranslateLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const location = useLocation();
  const isMounted = useRef(false);
  const queuedLanguage = useRef(null);
  const isApplyingLanguage = useRef(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenLanguageMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseLanguageMenu = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (code) => {
    applyLanguage(code);    // your existing logic
    handleCloseLanguageMenu();
  };

  const googleTranslateElementInit = useCallback(() => {
    if (window.googleTranslateInitialized) {
      // // console.log("Google Translate already initialized, skipping");
      setIsTranslateLoaded(true);
      if (queuedLanguage.current) {
        applyLanguage(queuedLanguage.current);
        queuedLanguage.current = null;
      }
      return;
    }

    try {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr,es,hi,bn,ta,ne,si,ur,dz,ps,zh-CN",
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
            autoDisplay: false,
          },
          "google_translate_element"
        );
        // // console.log("Google Translate initialized with HORIZONTAL layout");
        window.googleTranslateInitialized = true;
        setIsTranslateLoaded(true);
        setScriptError(false);

        const translateElement = document.getElementById("google_translate_element");
        if (translateElement) {
          translateElement.style.display = "block";
          translateElement.style.position = "static";
          translateElement.style.zIndex = "1000";
        }
      } else {
        // console.error("Google Translate API not fully loaded");
        setScriptError(true);
      }
    } catch (error) {
      // console.error("Error initializing Google Translate:", error);
      setScriptError(true);
    }
  }, []);

  const findGoogleTranslateSelector = useCallback(() => {
    // // console.log("Searching for .goog-te-combo...");
    let select = document.querySelector(".goog-te-combo");
    if (select) {
      // // console.log("Found .goog-te-combo in main DOM");
      return { type: "select", element: select };
    }

    const iframes = document.querySelectorAll("iframe");
    // console.log(`Found ${iframes.length} iframes`);
    for (const iframe of iframes) {
      try {
        select = iframe.contentDocument?.querySelector(".goog-te-combo");
        if (select) {
          // console.log("Found .goog-te-combo in iframe:", iframe.src);
          return { type: "select", element: select };
        }
      } catch (e) {
        console.warn("Cannot access iframe content:", e.message);
      }
    }

    // console.log("No .goog-te-combo found in main DOM or iframes");
    return null;
  }, []);

  const applyLanguage = useCallback(
    (langCode, attempts = 60, delay = 2000) => {
      if (isApplyingLanguage.current) {
        // console.log("Language change already in progress, queuing:", langCode);
        queuedLanguage.current = langCode;
        return;
      }

      if (!isTranslateLoaded) {
        // console.warn(`Google Translate not loaded, queuing language change: ${langCode}`);
        queuedLanguage.current = langCode;
        return;
      }

      isApplyingLanguage.current = true;
      const selector = findGoogleTranslateSelector();
      if (selector && selector.type === "select") {
        // console.log(`Applying language: ${langCode}, current value: ${selector.element.value}`);
        selector.element.value = langCode;
        const changeEvent = new Event("change", { bubbles: true });
        selector.element.dispatchEvent(changeEvent);

        setTimeout(() => {
          const translated = document.querySelector(`html[lang="${langCode}"]`);
          if (translated) {
            // console.log("Translation applied successfully for:", langCode);
            setLanguage(langCode);
            setScriptError(false);
            isApplyingLanguage.current = false;
            if (queuedLanguage.current) {
              const nextLang = queuedLanguage.current;
              queuedLanguage.current = null;
              applyLanguage(nextLang);
            }
          } else if (attempts > 0) {
            // console.warn(`Translation not applied for ${langCode}, retrying... (${attempts} left)`);
            setTimeout(() => applyLanguage(langCode, attempts - 1, delay), delay);
          } else {
            // console.error("Failed to apply translation after retries for:", langCode);
            setScriptError(true);
            isApplyingLanguage.current = false;
            setLanguage(langCode);
          }
        }, 5000);
      } else if (attempts > 0) {
        // console.warn(`Google Translate selector not found, retrying... (${attempts} left)`);
        setTimeout(() => applyLanguage(langCode, attempts - 1, delay), delay);
      } else {
        // console.error("Google Translate selector not found after retries");
        setScriptError(true);
        isApplyingLanguage.current = false;
        setLanguage(langCode);
      }

      setTimeout(() => {
        if (isApplyingLanguage.current) {
          // console.warn("applyLanguage timed out for:", langCode);
          isApplyingLanguage.current = false;
          setLanguage(langCode);
          if (queuedLanguage.current) {
            const nextLang = queuedLanguage.current;
            queuedLanguage.current = null;
            applyLanguage(nextLang);
          }
        }
      }, 80000);
    },
    [isTranslateLoaded, findGoogleTranslateSelector]
  );

  const modifyTranslateWidget = useCallback((attempts = 30, delay = 3000) => {
    const tryModify = (retryCount) => {
      let modified = false;

      // Check main DOM
      const gadget = document.querySelector(".skiptranslate.goog-te-gadget");
      if (gadget) {
        // console.log("Found .skiptranslate.goog-te-gadget in main DOM:", gadget.outerHTML);
        const targetLanguageDiv = gadget.querySelector("#\\:0\\.targetLanguage");
        if (targetLanguageDiv) {
          // Remove "Powered by" text nodes and specific span
          Array.from(gadget.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && /Powered by\s*/i.test(node.nodeValue)) {
              node.nodeValue = node.nodeValue.replace(/Powered by\s*/gi, "");
              // console.log("Removed 'Powered by' text node in main DOM");
              modified = true;
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "SPAN" && node.querySelector(".VIpgJd-ZVi9od-l4eHX-hSRGPd")) {
              node.remove();
              // console.log("Removed Google Translate link span in main DOM");
              modified = true;
            }
          });
        } else {
          // console.warn("Target language div (#:0.targetLanguage) not found in .skiptranslate.goog-te-gadget");
        }
      }

      // Check iframes
      const iframes = document.querySelectorAll("iframe");
      for (const iframe of iframes) {
        try {
          const gadgetInIframe = iframe.contentDocument?.querySelector(".skiptranslate.goog-te-gadget");
          if (gadgetInIframe) {
            // console.log("Found .skiptranslate.goog-te-gadget in iframe:", iframe.src, gadgetInIframe.outerHTML);
            const targetLanguageDiv = gadgetInIframe.querySelector("#\\:0\\.targetLanguage");
            if (targetLanguageDiv) {
              Array.from(gadgetInIframe.childNodes).forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE && /Powered by\s*/i.test(node.nodeValue)) {
                  node.nodeValue = node.nodeValue.replace(/Powered by\s*/gi, "");
                  // console.log("Removed 'Powered by' text node in iframe");
                  modified = true;
                } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "SPAN" && node.querySelector(".VIpgJd-ZVi9od-l4eHX-hSRGPd")) {
                  node.remove();
                  // console.log("Removed Google Translate link span in iframe");
                  modified = true;
                }
              });
            } else {
              // console.warn("Target language div (#:0.targetLanguage) not found in iframe .skiptranslate.goog-te-gadget");
            }
            break;
          }
        } catch (e) {
          // console.warn("Cannot access iframe content:", e.message);
        }
      }

      if (!modified && retryCount > 0) {
        if (process.env.NODE_ENV !== "production") {
          // console.warn(`.skiptranslate.goog-te-gadget not found or not modified, retrying... (${retryCount} left)`);
        }
        setTimeout(() => tryModify(retryCount - 1), delay);
      } else if (!modified && process.env.NODE_ENV !== "production") {
        // console.warn(".skiptranslate.goog-te-gadget not found or not modified after retries");
      } else if (modified) {
        // console.log("Successfully modified .skiptranslate.goog-te-gadget");
      }
    };
    tryModify(attempts);
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      // console.log("Translate component already mounted, skipping initialization");
      return;
    }
    isMounted.current = true;

    if (!document.getElementById("google_translate_element")) {
      // console.error("google_translate_element missing, recreating");
      const translateElement = document.createElement("div");
      translateElement.id = "google_translate_element";
      translateElement.style.display = "block";
      translateElement.style.position = "static";
      translateElement.style.zIndex = "1000";
      document.body.appendChild(translateElement);
    }

    const translateElement = document.getElementById("google_translate_element");
    if (translateElement && translateElement.hasAttribute("aria-hidden")) {
      // console.warn("aria-hidden detected on #google_translate_element, removing");
      translateElement.removeAttribute("aria-hidden");
    }
    const root = document.getElementById("root");
    if (root && root.hasAttribute("aria-hidden")) {
      // console.warn("aria-hidden detected on #root, removing");
      root.removeAttribute("aria-hidden");
    }

    const observer = new MutationObserver((mutations) => {
      let shouldModify = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.querySelector?.(".skiptranslate.goog-te-gadget") || node.classList?.contains("skiptranslate")) {
              shouldModify = true;
            }
          });
        }
        if (process.env.NODE_ENV !== "production") {
          // console.log("Mutation observed in google_translate_element:", {
          //   type: mutation.type,
          //   addedNodes: Array.from(mutation.addedNodes).map((node) => node.outerHTML || node.nodeName),
          //   removedNodes: Array.from(mutation.removedNodes).map((node) => node.outerHTML || node.nodeName),
          //   target: mutation.target.outerHTML?.substring(0, 200) || mutation.target.nodeName,
          // });
        }
      });
      if (shouldModify) {
        modifyTranslateWidget();
      }
    });
    if (translateElement) {
      observer.observe(translateElement, { childList: true, subtree: true, characterData: true });
    }

    const applyCustomUI = () => {
      const style = document.createElement("style");
      style.textContent = `
        .goog-te-gadget {
          display: block !important;
          margin-top: 8px;
          z-index: 1000;
        }
        .goog-te-gadget .goog-te-combo {
            margin: 0 0 10px 0;
        }
        #google_translate_element {
          display: block !important;
        }
        .goog-te-combo {
          max-width: 140px;
          min-width: 120px;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 6px 10px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          border: 1px solid #ccc;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'><path d='M7 10l5 5 5-5z'/></svg>");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 16px;
        }
        .goog-te-combo:hover {
          border-color: #6200ea;
        }
        .goog-te-combo:focus {
          border-color: #6200ea;
          border-width: 1px;
          outline: none;
        }
        .goog-te-combo option {
          font-size: 14px;
          padding: 6px 10px;
          background-color: #fff;
        }
        .goog-te-combo option:hover {
          background-color: #f3e5f5;
        }
        .goog-te-combo option:checked {
          background-color: #ede7f6;
        }
        .skiptranslate.goog-te-gadget > :not(#\\:0\\.targetLanguage) {
          display: none !important;
        }
        .goog-te-gadget-icon, .goog-te-banner-frame, .VIpgJd-ZVi9od-l4eHX-hSRGPd {
          display: none !important;
        }
          .goog-te-combo {
          display: none !important;
        }
        .skiptranslate {
          display: none !important;
        }
        #google_translate_element {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
      // console.log("Applied custom UI to .goog-te-combo");

      const updateOptions = () => {
        const select = document.querySelector(".goog-te-combo");
        if (select) {
          Array.from(select.options).forEach((option) => {
            const lang = languages.find((l) => l.code === option.value);
            if (lang) {
              option.textContent = `${lang.flag} ${lang.label}`;
            }
          });
        }
      };

      const interval = setInterval(() => {
        if (document.querySelector(".goog-te-combo")) {
          updateOptions();
          clearInterval(interval);
        }
      }, 500);
    };

    const loadScript = (retryCount = 5, retryDelay = 5000) => {
      if (!document.querySelector("#google-translate-script") && !window.googleTranslateInitialized) {
        const addScript = document.createElement("script");
        addScript.id = "google-translate-script";
        addScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        addScript.async = true;
        addScript.onload = () => {
          // console.log("Google Translate script loaded");
        };
        addScript.onerror = () => {
          // console.error("Failed to load Google Translate script");
          if (retryCount > 0) {
            // console.warn(`Retrying script load... (${retryCount} left)`);
            setTimeout(() => loadScript(retryCount - 1, retryDelay), retryDelay);
          } else {
            setScriptError(true);
          }
        };
        document.body.appendChild(addScript);
      } else if (window.googleTranslateInitialized) {
        setIsTranslateLoaded(true);
        // applyLanguage("en");
      }
    };

    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      // console.log("Google Translate API already loaded");
      googleTranslateElementInit();
      applyCustomUI();
      modifyTranslateWidget();
    } else {
      window.googleTranslateElementInit = googleTranslateElementInit;
      loadScript();
      applyCustomUI();
    }

    const checkDropdown = setTimeout(() => {
      const selector = findGoogleTranslateSelector();
      if (selector) {
        // console.log("Google Translate selector detected:", selector.type);
        setIsTranslateLoaded(true);
        // applyLanguage("en");
        modifyTranslateWidget();
      } else {
        // console.warn("Google Translate selector not found after delayed check");
        setScriptError(true);
        // setLanguage("en");
      }
      // console.log("google_translate_element content:", document.getElementById("google_translate_element")?.outerHTML || "Element not found");
    }, 30000);

    const interval = setInterval(() => {
      const modals = document.querySelectorAll(".MuiModal-root[aria-hidden='true'], .MuiPopover-root[aria-hidden='true']");
      modals.forEach((modal) => {
        // console.log("Removing aria-hidden from MuiModal/MuiPopover");
        modal.removeAttribute("aria-hidden");
      });
    }, 1000);

    return () => {
      clearTimeout(checkDropdown);
      clearInterval(interval);
      observer.disconnect();
      isMounted.current = false;
    };
  }, [googleTranslateElementInit, applyLanguage, findGoogleTranslateSelector, modifyTranslateWidget]);

  useEffect(() => {
    if (isTranslateLoaded && !isApplyingLanguage.current) {
      // applyLanguage("en");
    }
  }, [location, isTranslateLoaded, applyLanguage]);

  useEffect(() => {
    if (isTranslateLoaded) {
      const checkLanguage = () => {
        const selector = findGoogleTranslateSelector();
        if (selector?.type === "select" && selector.element.value && selector.element.value !== language) {
          // console.log(`Syncing UI language to: ${selector.element.value}`);
          setLanguage(selector.element.value);
          modifyTranslateWidget();
        }
      };
      const interval = setInterval(checkLanguage, 2000);
      return () => clearInterval(interval);
    }
  }, [isTranslateLoaded, language, findGoogleTranslateSelector, modifyTranslateWidget]);



  return (
    <Box sx={{ mx: 1 }}>
      <>
        <IconButton onClick={handleOpenLanguageMenu}>
          <StyledTooltip title="Translate">
            <TranslateIcon sx={{ fontSize: 28 }} />
          </StyledTooltip>
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseLanguageMenu}>
          {languages.map((lang) => (
            <MenuItem key={lang.code} onClick={() => handleLanguageSelect(lang.code)}>
              {lang.flag} {lang.label}
            </MenuItem>
          ))}
        </Menu>
      </>
      {scriptError && (
        <Typography
          color="error"
          sx={{
            fontSize: "12px",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Translation unavailable
        </Typography>
      )}
      <Box id="google_translate_element" sx={{ mt: 1, zIndex: 1000 }} />
    </Box>
  );
};

export default Translate;