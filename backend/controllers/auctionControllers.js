const Auction = require('../models/auctionModel');

exports.createAuction = async (req, res) => {
  try {
    const {
      picture,
      name,
      condition,
      category,
      closingDate,
      additionalPhotos,
      startingBid,
      allowInstantPurchase,
      description,
      location,
      age,
      createdBy,
    } = req.body;

    // Create a new auction
    const auction = new Auction({
      picture,
      name,
      condition,
      category,
      closingDate,
      additionalPhotos,
      startingBid,
      allowInstantPurchase,
      description,
      location,
      age,
      createdBy,
    });

    // Save the auction to the database
    await auction.save();

    res.status(201).json({ message: 'Auction created successfully.', auction });
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.deleteAuction = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the auction by ID and delete it
      const deletedAuction = await Auction.findByIdAndDelete(id);
  
      if (!deletedAuction) {
        return res.status(404).json({ error: "Auction not found." });
      }
  
      res.status(200).json({ message: 'Auction deleted successfully.' });
    } catch (error) {
      console.error('Error deleting auction:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  exports.extendAuction = async (req, res) => {
    try {
      const { id } = req.params;
      const { days } = req.body;
  
      // Find the auction by ID
      const auction = await Auction.findById(id);
  
      if (!auction) {
        return res.status(404).json({ error: "Auction not found." });
      }
  
      // Calculate the new closing date by adding the specified number of days to the current closing date
      const currentDate = new Date();
      const extendedDate = new Date(auction.closingDate);
      extendedDate.setDate(extendedDate.getDate() + days);
  
      // Check if the extended date is within the allowed range (not longer than 60 days ahead)
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 60);
      if (extendedDate > maxDate) {
        return res.status(400).json({ error: "Extended date exceeds the maximum allowed range." });
      }
  
      // Update the closing date of the auction
      auction.closingDate = extendedDate;
      await auction.save();
  
      res.status(200).json({ message: 'Auction closing date extended successfully.', auction });
    } catch (error) {
      console.error('Error extending auction:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  exports.getAllAuctions = async (req, res) => {
    try {
      const auctions = await Auction.find();
      res.status(200).json(auctions);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
exports.getAuction = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Auction.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Auction item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching auction item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAuctionsByCategory = async (req, res) => {
  const { category } = req.params; 
  console.log(category); 

  try {
    const auctions = await Auction.find({ category: category });

    if (!auctions || auctions.length === 0) {
      return res
        .status(404)
        .json({ message: "No auctions found in this category" });
    }

    res.status(200).json(auctions);
  } catch (error) {
    console.error("Error fetching auctions by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};  

