const Project = require("../models/Project");
const Client = require("../models/Client");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType
} = require("graphql");

// client type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString }
  })
});
// project type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    //how to add relationships
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      }
    }
  })
});

// RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    clients: {
      //clients is a collection of individual clients.
      // so we use GraphQLList to define its clientType
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      }
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      }
    }
  }
});

//mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    //add a client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone
        });
        return client.save();
      }
    },
    // delete client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
      }
    },
    // add project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              Completed: { value: "Completed" }
            },
          }),
          defaultValue: "Not started"
        },
        clientId: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId
        });
        return project.save();
      }
    },
    // delete project
    deleteProject:{
        type: ProjectType,
        args:{
            id: {type: GraphQLNonNull(GraphQLID)}
        },
        resolve(parent, args){
            return Project.findByIdAndRemove(args.id)

        }

    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});