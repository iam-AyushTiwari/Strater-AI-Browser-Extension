import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

function setupNodeToggle(dropdownTrigger: Element, nodeSwitcher: HTMLElement) {
  dropdownTrigger.addEventListener('click', () => {
    if (nodeSwitcher.classList.contains('ant-tree-switcher_close')) {
      nodeSwitcher.click(); // Expand node
    } else if (nodeSwitcher.classList.contains('ant-tree-switcher_open')) {
      nodeSwitcher.click(); // Collapse node
    }
  });
}

function checkAndSetupElements(root: Document | ShadowRoot) {
  const modal = root.querySelector(".ant-modal-mask");
  if (modal) {
    console.log("Modal found!");
  }

  const dropdownTriggers = root.querySelectorAll('.ant-dropdown-trigger');
  const nodeSwitchers = root.querySelectorAll('.ant-tree-switcher_close, .ant-tree-switcher_open');

  dropdownTriggers.forEach((trigger, index) => {
    const switcher = nodeSwitchers[index] as HTMLElement;
    if (trigger && switcher && !trigger.hasAttribute('data-event-attached')) {
      console.log("Dropdown Trigger and Node Switcher found!");
      setupNodeToggle(trigger, switcher);
      trigger.setAttribute('data-event-attached', 'true');
    }
  });
}

function observeShadowRoot() {
  const shadowRootContainer = document.getElementById('custom-sidebar-injected') as HTMLElement;
  if (shadowRootContainer && shadowRootContainer.shadowRoot) {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          console.log("Mutation activated in shadow root");
          checkAndSetupElements(shadowRootContainer.shadowRoot);
        }
      }
    });

    observer.observe(shadowRootContainer.shadowRoot, {
      childList: true,
      subtree: true,
    });

    // Initial check for the shadow root
    checkAndSetupElements(shadowRootContainer.shadowRoot);
  } else {
    console.log("Shadow root not found, retrying in 500ms");
    setTimeout(observeShadowRoot, 500);
  }
}

// Start observing the shadow root
observeShadowRoot();

// Observe the main document as well
const documentObserver = new MutationObserver(() => {
  checkAndSetupElements(document);
});

documentObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial check for the main document
checkAndSetupElements(document);
