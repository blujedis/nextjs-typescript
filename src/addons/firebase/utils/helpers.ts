

export const mapUser = async (user) => {
  const { uid, email, photoUrl, displayName, phoneNumber, providerId } = user
  const token = await user.getIdToken(true)
  return {
    id: uid,
    token,
    displayName,
    phoneNumber,
    email,
    photoUrl,
    providerId
  }
};