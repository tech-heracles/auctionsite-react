export class BidData {
    constructor(data = {}) {
      this.auctionId = data.auctionId || null;
      this.amount = data.amount || '';
    }

    validate(currentHighestBid, userBalance) {
      const errors = {};
  
      if (!this.auctionId) {
        errors.auctionId = 'Auction ID is required';
      }
  
      if (!this.amount) {
        errors.amount = 'Your offering must hold value, mortal';
      } else {
        const bidValue = parseFloat(this.amount);
        
        if (isNaN(bidValue) || bidValue <= 0) {
          errors.amount = 'Your offering must hold value, mortal';
        } else if (bidValue <= currentHighestBid) {
          errors.amount = `Your offering must exceed the current bid of ${currentHighestBid.toFixed(2)} $`;
        } else if (userBalance !== undefined && bidValue > userBalance) {
          errors.amount = `Your treasury holds only ${userBalance.toFixed(2)} $. You cannot offer what you do not possess.`;
        }
      }
  
      return errors;
    }
  
    isValid(currentHighestBid, userBalance) {
      const errors = this.validate(currentHighestBid, userBalance);
      return Object.keys(errors).length === 0;
    }
  
    toApiFormat() {
      return {
        auctionId: this.auctionId,
        amount: parseFloat(this.amount) || 0
      };
    }
  
    clone() {
      return new BidData({
        auctionId: this.auctionId,
        amount: this.amount
      });
    }
  
    update(property, value) {
      const newData = this.clone();
      if (newData.hasOwnProperty(property)) {
        newData[property] = value;
      }
      return newData;
    }
  
    static createDefault(auctionId, currentHighestBid) {
      return new BidData({
        auctionId: auctionId,
        amount: (currentHighestBid + 1).toFixed(2)
      });
    }
  }