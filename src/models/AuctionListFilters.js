export class AuctionListFilters {
    constructor(data = {}) {
      this.searchTerm = data.searchTerm || '';
      this.minPrice = data.minPrice || 0;
      this.maxPrice = data.maxPrice || 0;
    }

reset() {
    return new AuctionListFilters();
  }

  toQueryParams() {
    const params = {};
    if (this.searchTerm) params.searchTerm = this.searchTerm;
    if (this.minPrice > 0) params.minPrice = this.minPrice;
    if (this.maxPrice > 0) params.maxPrice = this.maxPrice;
    return params;
  }

  update(property, value) {
    const newFilters = this.clone();
    if (newFilters.hasOwnProperty(property)) {
      newFilters[property] = value;
    }
    return newFilters;
  }

  hasActiveFilters() {
    return (
      this.searchTerm !== '' ||
      this.minPrice > 0 ||
      this.maxPrice > 0
    );
  }

  clone() {
    return new AuctionListFilters({
      searchTerm: this.searchTerm,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    });
  }
}
