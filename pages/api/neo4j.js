import neo4j from 'neo4j-driver'

export default async function handler(req, res) {
  const body = req.body
  if (req.method === 'POST' && body.secret === process.env.SECRET) {
    const user = process.env.USERNAME
    const password = process.env.PASSWORD
    const driver = neo4j.driver(process.env.DATABASE, neo4j.auth.basic(user, password))
    const session = driver.session()
    let result = null
    try {
      result = await session.run(
        body.statement,
        body.parameter
      )
    } catch(e) {
      res.status(500).json({message: e.message})
      return
    }finally {
      await session.close()
    }
    await driver.close()
    res.status(200).json(result.records)
  } else {
    res.status(401).json({message: "Forbidden"})
  }
}
