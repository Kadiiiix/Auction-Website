const Auction = require('../models/auctionModel');

exports.createAuction = async (req, res) => {
  try {
    const {
      imageUrl,
      name,
      condition,
      category,
      closingDate,
      additionalImageUrls,
      startingBid,
      description,
      location,
      age,
      createdBy,
    } = req.body;

    // Create a new auction
    const auction = new Auction({
      picture: imageUrl,
      name,
      condition,
      category,
      closingDate,
      additionalPhotos: additionalImageUrls,
      startingBid,
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


exports.getAuctionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all auctions created by the specified user
    const auctions = await Auction.find({ createdBy: userId });

    if (auctions.length === 0) {
      return res.status(404).json({ message: "No auctions found for this user." });
    }

    res.status(200).json(auctions);
  } catch (error) {
    console.error('Error fetching auctions by user:', error);
    res.status(500).json({ error: 'Internal server error.' });
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

exports.searchAuctions = async (req, res) => {
  try {
    const query = req.query.query;
    const regex = new RegExp(query, "i"); // Case-insensitive search

    // Search for auctions that match the query
    const results = await Auction.find({ name: { $regex: regex } });

    if (results.length === 0) {
      return res.status(404).json({ error: "No matching auctions found" });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching auctions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.placeBid = async (req, res) => {
  const { auctionId, userId, amount } = req.params;

  try {
    // Find the auction by ID
    const auction = await Auction.findById(auctionId);

    // Check if the auction exists
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Check if the auction has already ended
    if (auction.closingDate <= new Date()) {
      return res.status(400).json({ message: "Auction has already ended" });
    }

    // Check if the bid amount is valid
    if (amount <= auction.highestBid || amount < auction.startingBid) {
      return res.status(400).json({ message: "Invalid bid amount" });
    }
    if (!auction.bidderIds.includes(userId)) {
      auction.bidderIds.push(userId); // Add the user ID to the bidderIds array
    }

    // Place the bid
    auction.highestBid=amount;
    auction.highestBidder = userId;
    await auction.save();

    return res.status(200).json({ message: "Bid placed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.closeAuction = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the auction by ID
    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    // Set the closing date to the current moment
    auction.closingDate = new Date();
    
    // Save the changes to the auction
    await auction.save();
    res.status(200).json({ message: 'Auction closed successfully.', auction });
  } catch (error) {
    console.error('Error closing auction:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
exports.getSimilar = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Find products in the same category
    const similarProducts = await Auction.find({
      category: auction.category,
      _id: { $ne: auctionId },
    }).limit(5); // Limit to 10 similar products

    res.status(200).json(similarProducts);
  } catch (error) {
    console.error("Error getting similar auctions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAuctionsSortedByLiked = async (req, res) => {
  try {
    const auctions = await Auction.aggregate([
      { $addFields: { likedByCount: { $size: "$likedBy" } } },
      { $sort: { likedByCount: -1 } },
    ]);

    res.status(200).json(auctions);
  } catch (error) {
    console.error("Error fetching and sorting auctions by liked:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAuctionsSortedByDate = async (req, res) => {
  try {
    const auctions = await Auction.aggregate([
      {
        $match: {
          createdAt: { $exists: true }, 
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json(auctions);
  } catch (error) {
    console.error("Error fetching and sorting auctions by date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.filterAuctions = async (req, res) => {
  try {
    // Extracting filtering criteria from request body
    const {
      condition, 
      category,
      startDate,
      endDate,
      location,
      maxPrice,
     
    } = req.body;

    // Building query based on criteria
    const query = {};
    if (condition) query.condition = condition;
    if (category) query.category = category;
    if (startDate && endDate)
      query.closingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }; 
    if (location) query.location = location;
    if (maxPrice) query.startingBid = { $lte: maxPrice };
   
    

    // Fetching auctions based on query and sorting by createdAt in descending order
    const auctions = await Auction.find(query);

    res.status(200).json(auctions);
  } catch (error) {
    console.error("Error filtering auctions:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
