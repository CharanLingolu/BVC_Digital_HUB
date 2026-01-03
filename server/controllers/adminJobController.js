import Job from "../models/Job.js";
import User from "../models/User.js";
import Staff from "../models/Staff.js";
import { sendEmail } from "../utils/sendEmail.js";

// ================= GET ALL JOBS =================
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CREATE JOB (WITH EMAIL) =================
export const createJob = async (req, res) => {
  try {
    // 🔹 Save Job
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();

    // 🔹 Fetch all student + staff emails (Efficiently)
    const students = await User.find({ email: { $exists: true } }).select(
      "email"
    );
    const staff = await Staff.find({ email: { $exists: true } }).select(
      "email"
    );

    // 🔹 Merge and Remove Duplicates
    const uniqueEmails = [
      ...new Set([
        ...students.map((s) => s.email),
        ...staff.map((f) => f.email),
      ]),
    ];

    // 🔹 Send Email Notification
    if (uniqueEmails.length > 0) {
      await sendEmail({
        to: uniqueEmails, // Updated sendEmail handles this array automatically
        subject: `📢 New Job Opportunity: ${savedJob.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
            <h2 style="color:#2563eb; margin-bottom: 10px;">${
              savedJob.title
            }</h2>
            <p><strong>Company:</strong> ${savedJob.company}</p>
            <p><strong>Location:</strong> ${savedJob.location}</p>
            <p><strong>Job Type:</strong> ${savedJob.type}</p>
            ${
              savedJob.salary
                ? `<p><strong>Salary:</strong> ${savedJob.salary}</p>`
                : ""
            }
            <p><strong>Deadline:</strong> ${
              savedJob.deadline
                ? new Date(savedJob.deadline).toDateString()
                : "Not specified"
            }</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p style="margin:0;">${savedJob.description}</p>
            </div>
            ${
              savedJob.link
                ? `<p><a href="${savedJob.link}" target="_blank" style="background-color: #2563eb; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Apply Here</a></p>`
                : ""
            }
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
            <p style="font-size:12px;color:#6b7280">
              Career Portal | This is an automated notification
            </p>
          </div>
        `,
      });
    }

    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Job creation failed:", error);
    res.status(400).json({ message: error.message });
  }
};

// ================= UPDATE JOB (WITH EMAIL) =================
export const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔹 Fetch all emails
    const students = await User.find({ email: { $exists: true } }).select(
      "email"
    );
    const staff = await Staff.find({ email: { $exists: true } }).select(
      "email"
    );

    // 🔹 Merge and Remove Duplicates
    const uniqueEmails = [
      ...new Set([
        ...students.map((s) => s.email),
        ...staff.map((f) => f.email),
      ]),
    ];

    // 🔹 Send Email Notification for Update
    if (uniqueEmails.length > 0) {
      await sendEmail({
        to: uniqueEmails,
        subject: `🔄 Updated Job Opportunity: ${updatedJob.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
            <h2 style="color:#2563eb; margin-bottom: 10px;">Updated: ${
              updatedJob.title
            }</h2>
            <p style="color: #4b5563;">Details for this job posting have been updated.</p>
            
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
                <p><strong>Company:</strong> ${updatedJob.company}</p>
                <p><strong>Location:</strong> ${updatedJob.location}</p>
                <p><strong>Job Type:</strong> ${updatedJob.type}</p>
                ${
                  updatedJob.salary
                    ? `<p><strong>Salary:</strong> ${updatedJob.salary}</p>`
                    : ""
                }
                <p><strong>Deadline:</strong> ${
                  updatedJob.deadline
                    ? new Date(updatedJob.deadline).toDateString()
                    : "Not specified"
                }</p>
            </div>

            <p style="margin-top: 15px;">${updatedJob.description}</p>
            
            ${
              updatedJob.link
                ? `<p><a href="${updatedJob.link}" target="_blank" style="color: #2563eb; font-weight: bold;">Apply Here &rarr;</a></p>`
                : ""
            }
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
            <p style="font-size:12px;color:#6b7280">
              Career Portal | This is an automated notification regarding a job update
            </p>
          </div>
        `,
      });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Job update failed:", error);
    res.status(400).json({ message: error.message });
  }
};

// ================= DELETE JOB =================
export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
