class HistoryEntry {
    constructor(url, isImage, imageData) {
        this.url = url;
        this.isImage = isImage;
        if (isImage) {
            this.imageData = imageData;
        }
    }
}

class CompleteHistoryEntry {
    constructor(historyEntry, backClicked) {
        this.historyEntry = historyEntry;
        this.backClicked = backClicked;
    }
}

class PageHistory {
    constructor(currentPage, button) {
        this.currentPage = currentPage;
        this.history = [];
        this.completeHistory = [];
        this.backButton = button;
    }

    updateButtonAppearance(on) {
        if (on) {
            this.backButton.removeClass('mturk-top-banner-back-woh');
            this.backButton.addClass('mturk-top-banner-back-wh');
        } else {
            this.backButton.removeClass('mturk-top-banner-back-wh');
            this.backButton.addClass('mturk-top-banner-back-woh');
        }
    }

    forwardHistory(nextURL, imageData) {
        const historyEntry = new HistoryEntry(this.currentPage, (imageData === null), imageData);
        this.history.push(historyEntry);
        this.completeHistory.push(new CompleteHistoryEntry(historyEntry, false));
        this.currentPage = nextURL;
        if (this.history.length == 1) {
            this.updateButtonAppearance(true);
        }
        return nextURL;
    }

    backHistory() {
        if (this.history.length > 0) {
            const lastEntry = this.history.pop();
            this.completeHistory.push(new CompleteHistoryEntry(new HistoryEntry(this.currentPage, null, false), true));
            this.currentPage = lastEntry.url;
            this.imageData = lastEntry.imageData;
            if (this.history.length == 0) {
                this.updateButtonAppearance(false);
            }
            return {
                success: true,
                url: lastEntry.url,
                isImage: lastEntry.isImage,
                imageData: lastEntry.imageData
            }
        } else {
            return {
                success: false,
            }
        }
    }
}