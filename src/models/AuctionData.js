export class AuctionData {
    constructor(data = {}) {
      this.title = data.title || '';
      this.description = data.description || '';
      this.startingBid = data.startingBid || '';
      this.endDate = data.endDate || '';
      this.imageUrl = data.imageUrl || '';
    }
  
    validate() {
      const errors = {};
  
      if (!this.title) {
        errors.title = 'The treasure must have a name';
      } else if (this.title.length < 5) {
        errors.title = 'Title must be at least 5 characters';
      } else if (this.title.length > 100) {
        errors.title = 'Title must not exceed 100 characters';
      }
  
      if (!this.description) {
        errors.description = 'You must describe your treasure to the mortals';
      } else if (this.description.length > 1000) {
        errors.description = 'Description must not exceed 1000 characters';
      }
  
      if (!this.startingBid) {
        errors.startingBid = 'Set your initial offering price';
      } else if (parseFloat(this.startingBid) <= 0) {
        errors.startingBid = 'Offerings must be positive';
      }
  
      if (!this.endDate) {
        errors.endDate = 'When shall this auction conclude?';
      } else {
        const endDateObj = new Date(this.endDate);
        const now = new Date();
        if (endDateObj <= now) {
          errors.endDate = 'The end date must lie in the future';
        }
      }

      if (this.imageUrl && !this.isValidUrl(this.imageUrl)) {
        errors.imageUrl = 'Provide a valid scroll of imagery';
      }
  
      return errors;
    }
  
    isValid() {
      const errors = this.validate();
      return Object.keys(errors).length === 0;
    }
  
    isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    }

    toApiFormat() {
      return {
        title: this.title,
        description: this.description,
        startingBid: parseFloat(this.startingBid) || 0,
        endDate: this.endDate,
        imageUrl: this.imageUrl || null
      };
    }
  
    clone() {
      return new AuctionData({
        title: this.title,
        description: this.description,
        startingBid: this.startingBid,
        endDate: this.endDate,
        imageUrl: this.imageUrl
      });
    }
  
    update(property, value) {
      const newData = this.clone();
      if (newData.hasOwnProperty(property)) {
        newData[property] = value;
      }
      return newData;
    }
  }