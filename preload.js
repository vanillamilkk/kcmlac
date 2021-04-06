/*  Kami Cinta Mam Lilia
 *  Official Anti Cheat Client
 * 
 *  Copyright vanillamilkk 2021
 *  GNU General Public License v3.0
 */

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
