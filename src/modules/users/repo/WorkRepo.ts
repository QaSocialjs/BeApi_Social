import { DbClient } from "../../../../scripts/db/dbclient/dbclient";
import { Work } from "../../../infrastructure/sequelize/models/Work";
import { Document } from "mongodb";
export interface IWorkRepo {
  findWorkByCompany(company: string): Promise<Work[] | null>;
  findWorkByCompanyRegex(company: string): Promise<Work[] | null>;
  SearchWorkByCompanyAgg(company: string): Promise<Document[] | null>;
  save(work: Work): Promise<void>;
  update(user: Work): Promise<void>;
}

export class WorkRepo implements IWorkRepo {
  public async findWorkByCompany(company: string): Promise<Work[] | null> {
    const response = await DbClient.instance.collections.work
      .find({
        $text: {
          $search: company,
        },
      })
      .toArray();

    return response;
  }
  public async findWorkByCompanyRegex(company: string): Promise<Work[] | null> {
    const reGexPattern = new RegExp(company, "i");
    return await DbClient.instance.collections.work
      .find({
        company: {
          $regex: reGexPattern,
        },
      })
      .toArray();
  }
  public async SearchWorkByCompanyAgg(
    company: string
  ): Promise<Document[] | null> {
    const response = await DbClient.instance.collections.work
      .aggregate([
        {
          $search: {
            compound: {
              must: [
                {
                  text: {
                    query: company,
                    path: "company",
                  },
                },
              ],
            },
          },
        },
      ])
      .toArray();
    return response;
  }

  public async save(work: Work): Promise<void> {
    await DbClient.instance.collections.work.insertOne(work);
  }
  public async update(work: Work): Promise<void> {
    const filter = { company: work.company };
    const options: { $set: Work } = { $set: work };
    await DbClient.instance.collections.work.updateOne(filter, options);
  }
}
