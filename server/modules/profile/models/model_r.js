"use strict";

const { Op, Company, Member, User } = require("../../../models");
const getCompanyIdByCode = require("../../../helper/companyHelper").getCompanyIdByCode;
const moment = require("moment");

class model_r {
    constructor(req) {
      this.req = req;
      this.company_id = null;
    }
  
    async initialize() {
      if (!this.company_id) {
        this.company_id = await getCompanyIdByCode(this.req);
      }
    }

    async getProfile() {
        const { type: role, id: memberId } = this.req.user;
    
        if (role === 'administrator') { 
            await this.initialize(); 
            const companyProfile = await Company.findOne({
                where: { id: this.company_id },
                attributes: ['company_name', 'username', 'email', 'logo', 'whatsapp_company_number'],
            });
    
            if (!companyProfile) {
                throw new Error("Profil perusahaan tidak ditemukan.");
            }
            return companyProfile;
        }
    
        if (role === 'staff') {
            const memberProfile = await Member.findOne({
                where: { id: memberId },
                attributes: ['fullname', 'email', 'identity_number', 'gender', 'photo', 'whatsapp_number', 'birth_date'],
            });
    
            if (!memberProfile) {
                throw new Error("Profil staff tidak ditemukan.");
            }
            const profileData = memberProfile.toJSON();
            profileData.username = profileData.whatsapp_number;

            return profileData;
        }
    
        throw new Error("Peran pengguna tidak dikenali atau tidak valid.");
    }
}

module.exports = model_r;