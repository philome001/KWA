export function confirmpasswordValidator(password1,password2) {
    if (!(password1||password2)) return "Password can't be empty."
    if (password1!=password2) return "Passwords must match"
   
    return ''
    
  }