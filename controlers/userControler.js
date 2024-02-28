
const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");
const userMoades = require("../moadel/userMoades");
const Trangision = require("../moadel/trangestionFeeModel");
const addUser = expressAsyncHandler(async (req, res) => {
    const { name, email, nid, number, pin , selectedItem } = req.body;
    
    const balance = selectedItem === "User" ? 40 : 100000;    
    const userStatus = "User";
    
   const role = selectedItem
   const mobileNumber = number  
    console.log(name,pin,email,mobileNumber,nid,selectedItem);
  
    // Check if user already exists
    const userExist = await userMoades.findOne({ email });
    if (userExist) {
      res.status(405).send("This email already exists");
      throw new Error("User email already exists");
      return
    }

    const nidExist = await userMoades.findOne({ nid });
    if (nidExist) {
      res.status(400).send("This NID already exists");
      throw new Error("User already exists");
      return
    }

    const mobileExist = await userMoades.findOne({ mobileNumber });
    if (mobileExist) {
      res.status(406).send("This mobile number already exists");
      throw new Error("User already exists");
    }
  
    // Create a new user
    const user = await userMoades.create({
      name, email, nid, mobileNumber, pin, balance, role,userStatus
    });

    if (user) {
      res.status(201).json(user);
    } else {
      res.status(400);
      throw new Error("Registration Error");
    }
});
const sendMoney = expressAsyncHandler(async (req, res) => {
    const { userEmail, mobileNumber, sendAmount } = req.body;

    // Convert mobileNumber to a number if it's a string
    const formattedMobileNumber = parseInt(mobileNumber);

    // Check if the conversion was successful
    if (isNaN(formattedMobileNumber)) {
        res.status(400).send('Invalid mobile number');
        return;
    }

    // Find sender's information
    const sender = await userMoades.findOne({ email: userEmail });
    if (!sender) {
        res.status(404).send('Sender not found');
        return;
    }

    // Validate sendAmount
    const parsedSendAmount = parseFloat(sendAmount);
    if (isNaN(parsedSendAmount) || parsedSendAmount < 20) {
        res.status(400).send('Minimum send amount is 20 taka');
        return;
    }

    // Check sender's balance
    if (sender.balance < parsedSendAmount) {
        res.status(400).send('Insufficient balance');
        return;
    }

    // Find receiver's information
    const receiver = await userMoades.findOne({ mobileNumber: formattedMobileNumber });
    if (!receiver) {
        res.status(404).send('Receiver not found');
        return;
    }

    // Calculate new balances
    const transactionFee = parsedSendAmount * 0.05;
    const receiverNewBalance = receiver.balance + parsedSendAmount;
    const senderNewBalance = sender.balance - parsedSendAmount - transactionFee;

    // Update balances in the database
    sender.balance = senderNewBalance;
    receiver.balance = receiverNewBalance;
    await sender.save();
    await receiver.save();
    const trangisonDetails = {
        name:sender.name,
        senderEmail: sender.email,
        reciverEmail: receiver.email,
        transactionFee,
        trangisionAmount: sendAmount
    }
    console.log(trangisonDetails);
    const saveTringsonDetails = await Trangision.create(trangisonDetails);
    // Respond with success message
    console.log(saveTringsonDetails);
    res.status(200).send('Money sent successfully');
});

const cashOut = expressAsyncHandler(async (req, res) => {
  const { cashOutNumber, email, pin, cashOutAmount } = req.body;
  console.log(cashOutNumber);
  try {
      // Find the user, agent, and admin
      const user = await userMoades.findOne({ email });
      const agent = await userMoades.findOne({ mobileNumber:cashOutNumber });
      const admin = await userMoades.findOne({ role: "Admin" });

      // if (!user || !agent || !admin) {
      //     res.status(404).send("User, agent, or admin not found");
      //     return;
      // }
      console.log(agent);

      if (parseInt(pin) !== parseInt(user.pin)) {
          res.status(406).send("Pin Number is Incorrect");
          return;
      } else if (user.balance < cashOutAmount) {
          res.status(406).send("Not enough balance");
          return;
      }
      if (!agent) {
        res.status(404).send("Agent not found");
        return;
    }
    
      // Update user's balance
      console.log(user);
      const userCurrentBalance = user.balance - cashOutAmount + cashOutAmount * 0.01;
      user.balance = userCurrentBalance;
      await user.save();

      // Update agent's balance and income
      // const agentBalance = agent.balance + cashOutAmount;
      // const agentIncome = agent.income + (cashOutAmount * 0.01);
      // // agent.balance = agentBalance;
      // const agentNEtBalance = agentBalance + agentIncome
      // agent.balance = agentNEtBalance;
      // await agent.save();

      // // // // Update admin's income
      const adminIncome = admin.balance + (cashOutAmount * 0.005);
      const adminBAlance = admin.balance + adminIncome ;
      admin.balance = adminBAlance;
      await admin.save();

      res.status(200).send("Cash-out transaction successful");
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});


module.exports = {
    addUser,sendMoney,cashOut
};
