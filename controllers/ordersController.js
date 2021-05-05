const { request } = require("express");
const Order = require("../models/Order");


exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
        if (!orders) throw new Error("Orders not found");
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

exports.getOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
        if (!order) throw new Error("Order not found");
        res.json(order);
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndRemove(id)
        if (!order) throw new Error("Cannot delete. Order not found");
        res.json(order);
    } catch (error) {
        next(error);
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndUpdate(id, req.body, { new: true })
        if (!order) throw new Error("Cannot update. Order not found");
        res.json(order);
    } catch (error) {
        next(error);
    }   
};

exports.addOrder = async (req, res, next) => {
    try {
        const entry = req.body
        const order = await Order.create(entry)
        if (!order) throw new Error("Cannot add new order");
        res.json(order);
    } catch (error) {
        next(error);
    }   
};
