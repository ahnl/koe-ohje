import { initializeLanguage } from './common/language'
import { initializeCopyToClipboard } from './common/clipboard'
import { initializeTablesorter } from './common/tablesorter'
import { initializeToc } from './common/toc'
import { clearSearch, createSearchIndex } from './common/search'
import { loadHtml } from '../util/loadHtml'

export enum Tab {
  Chemistry = 'chemistry',
  Math = 'math',
  Physics = 'physics',
}

declare global {
  interface Window {
    initializeTocBot: () => void
  }
}

const loadTab = (oldTab: Tab, newTab: Tab) => {
  const loadingScreen = document.getElementById('loading')
  loadingScreen.classList.remove('hidden')

  window.location.hash = ''
  clearSearch()

  // This timeout makes sure that the loading screen renders before executing the load tab code
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setTimeout(async () => {
    console.log(oldTab, newTab)
    const oldTabElement = document.getElementById(`tab-${oldTab}`)
    oldTabElement.classList.remove('active')
    while (oldTabElement.firstChild) {
      oldTabElement.removeChild(oldTabElement.firstChild)
    }

    const newTabElement = document.getElementById(`tab-${newTab}`)
    newTabElement.classList.add('active')

    const tabHtml = await loadHtml(`tab-${newTab}.html`)
    newTabElement.innerHTML = tabHtml

    initializeLanguage()
    initializeCopyToClipboard()
    initializeTablesorter()
    createSearchIndex()

    initializeToc()

    loadingScreen.classList.add('hidden')
  }, 0)
}

const handleChangeTab = (event: MouseEvent) => {
  const clickedTabButton = event.currentTarget as HTMLElement
  const clickedTab = clickedTabButton?.dataset.tabId as Tab

  const currentTabButton = document.querySelector<HTMLElement>('.tab-menu-option.active')
  const currentTab = currentTabButton?.dataset.tabId as Tab
  if (currentTab === clickedTab) return

  clickedTabButton.classList.add('active')
  currentTabButton.classList.remove('active')

  loadTab(currentTab, clickedTab)
}

export const initializeTabs = () => {
  const menuItems = Array.from(document.querySelectorAll('#tab-menu .tab-menu-option'))
  menuItems.forEach((element) => element.addEventListener('click', handleChangeTab))

  loadTab(Tab.Math, Tab.Math)
}
