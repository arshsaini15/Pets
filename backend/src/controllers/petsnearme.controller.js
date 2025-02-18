import { Pet } from '../models/pet.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const petsNearMe = asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  const nearbyPets = await Pet.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: 5000, // 5 km radius
      },
    },
  })

  res.status(200).json({ success: true, count: nearbyPets.length, data: nearbyPets });
})