export function nameValidator(name) {
  if (!name) return "Name can't be empty."
    
  if(!name.includes(' ')) return "Please enter two names."
  return ''


}
