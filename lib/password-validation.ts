export interface PasswordValidation {
  isValid: boolean
  score: number
  requirements: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    number: boolean
    special: boolean
  }
  message: string
}

export function validatePassword(password: string): PasswordValidation {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }

  const score = Object.values(requirements).filter(Boolean).length
  const isValid = score >= 4 && requirements.length

  let message = ''
  if (!isValid) {
    const missing = []
    if (!requirements.length) missing.push('at least 8 characters')
    if (!requirements.uppercase) missing.push('an uppercase letter')
    if (!requirements.lowercase) missing.push('a lowercase letter')
    if (!requirements.number) missing.push('a number')
    if (!requirements.special) missing.push('a special character')
    
    message = `Password must contain ${missing.join(', ')}`
  }

  return {
    isValid,
    score,
    requirements,
    message
  }
}

export function getPasswordStrengthColor(score: number): string {
  if (score <= 1) return 'text-red-600'
  if (score <= 2) return 'text-orange-600'
  if (score <= 3) return 'text-yellow-600'
  if (score <= 4) return 'text-blue-600'
  return 'text-green-600'
}

export function getPasswordStrengthText(score: number): string {
  if (score <= 1) return 'Very Weak'
  if (score <= 2) return 'Weak'
  if (score <= 3) return 'Fair'
  if (score <= 4) return 'Good'
  return 'Strong'
}
