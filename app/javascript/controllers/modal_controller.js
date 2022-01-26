import {Controller} from '@hotwired/stimulus'

export default class extends Controller {
    static get targets() {
        return ['wrapper', 'container', 'content', 'background']
    }

    static get values() {
        return {
            url: String,
            turbo: { type: Boolean, default: true }
        }
    }

    initialize() {
        this.open = false
    }

    view(e) {
        if (e.target !== this.wrapperTarget &&
            !this.wrapperTarget.contains(e.target)) return

        if (!this.open) {
            this.wrapperTarget.insertAdjacentHTML('afterbegin', this.template())
            this.getContent(this.urlValue)
            this.open = true
        }
    }

    close(e) {
        e.preventDefault()

        if (this.open) {
            if (this.hasContainerTarget) {
                this.containerTarget.remove()
                this.open = false
            }
        }
    }

    closeBackground(e) {
        if (e.target === this.backgroundTarget) {
            this.close(e)
        }
    }

    closeWithKeyboard(e) {
        if (e.keyCode === 27) {
            this.close(e)
        }
    }

    getContent(url) {
        if (this.turboValue){
            this.contentTarget.innerHTML = `
            <turbo-frame id="modal_content" src=${this.urlValue}>
            Loading..
            </turbo-frame>
            `
            return;
        }
        fetch(url).then(response => {
            if (response.ok) {
                return response.text()
            }
        })
            .then(html => {
                this.contentTarget.innerHTML = html
            })
    }

    template() {
        return `      
        <div data-modal-target='container' class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div data-modal-target='background' data-action='click->modal#closeBackground' class="fixed inset-0 backdrop-blur-md bg-gray-200/50 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white border border-black px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                    <button data-action='click->modal#close' type="button" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span class="sr-only">Close</span>
                        <!-- Heroicon name: outline/x -->
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div data-modal-target='content'></div>
            </div>
          </div>
        </div>
    `
    }
}