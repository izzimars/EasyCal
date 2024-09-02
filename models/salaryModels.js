// const mongoose = require("mongoose");

// const SalarySchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   salary: { type: Array, default: [] },
//   monthlyUpdate: { type: Number, default: -1 },
//   monthTogle: { type: Boolean, required: true, default: false },
//   weeksalary: { type: Array, default: [] },
//   weeklyUpdate: { type: Number, default: -1 },
//   weekTogle: { type: Boolean, required: true, default: false },
//   dailysalary: { type: Array, default: [] },
//   dailyUpdate: { type: Number, default: -1 },
//   dailyTogle: { type: Boolean, required: true, default: false },
//   expiresat: Date,
// });

// SalarySchema.post("findOne", async function (doc) {
//   if (!doc) return;
//   const currentMonth = new Date().getMonth();
//   if (doc.monthlyUpdate !== currentMonth) {
//        doc.salary = doc.salary.slice(-6);
//        doc.monthlyUpdate = currentMonth;
//    }

//   if (doc.weekTogle) {
//     let update = updatedMonthlySalary(doc.weeksalary);
//     if (doc.Salary[0])
//   }
//   if (doc.dailyTogle) {
//     doc.Salary[0] = updatedMonthlySalary(doc.weeksalary);
//   }
//   await doc.save(); // Save the document after modifications
// });

// function recalculateMonthlyAverage(docSalaryyy) {
//   // Assuming weekly salaries are stored in `weeksalary` as an array
//   const totalWeeklySalary = doc.weeksalary.reduce(
//     (acc, salary) => acc + salary,
//     0
//   );
//   const totalDailySalary = doc.dailysalary.reduce(
//     (acc, salary) => acc + salary,
//     0
//   );
//   const averageMonthlySalary = (totalWeeklySalary + totalDailySalary) / 4; // Example calculation
//   // Store the recalculated average in the salary array
//   doc.salary.push(averageMonthlySalary);
// }

// const Salary = mongoose.model("SalarySchema", SalarySchema);

// module.exports = Salary;
