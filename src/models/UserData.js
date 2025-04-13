export class UserData {
    constructor(data = {}) {
      this.username = data.username || '';
      this.email = data.email || '';
      this.password = data.password || '';
      this.confirmPassword = data.confirmPassword || '';
    }
  
    validate() {
      const errors = {};
  
      if (!this.username) {
        errors.username = 'A hero requires a name';
      } else if (this.username.length < 3) {
        errors.username = 'Your heroic name must be at least 3 characters';
      } else if (this.username.length > 20) {
        errors.username = 'Your heroic name must not exceed 20 characters';
      }
  
      if (!this.email) {
        errors.email = 'The gods require your email';
      } else if (!this.isValidEmail(this.email)) {
        errors.email = 'The message scroll address is invalid';
      }
  
      if (!this.password) {
        errors.password = 'A password is required to protect your treasures';
      } else if (this.password.length < 8) {
        errors.password = 'Your sacred password must be at least 8 characters';
      }
  
      if (!this.confirmPassword) {
        errors.confirmPassword = 'Confirm your sacred oath';
      } else if (this.password !== this.confirmPassword) {
        errors.confirmPassword = 'Your oaths do not match';
      }
  
      return errors;
    }
  
    isValid() {
      const errors = this.validate();
      return Object.keys(errors).length === 0;
    }
  
    isValidEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  
    toApiFormat() {
      return {
        username: this.username,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      };
    }
  
    toLoginData() {
      return {
        username: this.username,
        password: this.password
      };
    }
  
    clone() {
      return new UserData({
        username: this.username,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
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