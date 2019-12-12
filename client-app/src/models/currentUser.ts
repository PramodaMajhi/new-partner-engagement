
// the one and only current user is stored at store.values.currentUser
// by the action getCurrentUser.ts # getCurrentUser

export class CurrentUser {
    id: number;
    email: string;
    title: string;
    admin1: boolean;
    userType:string;
    adminForCategories: number[];
    disableAdmin1Role: boolean;

    constructor(id, email, title, admin1, userType, adminForcategories=[], disableAdminRole=false) {
      this.id = id
      this.email = email
      this.title = title
      this.admin1 = admin1
      this.userType = userType
      this.adminForCategories = adminForcategories
      this.disableAdmin1Role = false
    }

    copy = () => {
      const cu =new CurrentUser(this.id, this.email, this.title, this.admin1, this.userType, 
                                this.adminForCategories, this.disableAdmin1Role)
      return cu
    }

    // add a array of category for which user is an admin
    setAdminForCategories = (categoryIds: number[]) => {
      this.adminForCategories = categoryIds
    }

    setDisableAdmin1 = (value) => {
      this.disableAdmin1Role = value
    }
   
    // virtual admin1 roles is turned off by setting store.values.disableAdmin1Role to true
    isAdmin1 = () => {
      if (this.disableAdmin1Role) {
        return false
      }
      return this.admin1
    }

    isRealAdmin1 = () => {
      return this.admin1
    }

    isAdminForSomeCategory = () => {
      return this.adminForCategories.length > 0
    }

    isAdminForCategory = (categoryId: number) => {
      return (this.adminForCategories.includes(categoryId))
    }

    /* Is user an admin of any kind? */
    
    isAnyAdmin = () => {
      return this.isAdmin1() || this.isAdminForSomeCategory()    
    }
}
