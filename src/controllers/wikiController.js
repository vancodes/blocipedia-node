const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application");
const markdown = require( "markdown" ).markdown;

module.exports = {
  
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
        if(err){                
            res.redirect(500, "static/index");
        } else {
            res.render("wikis/index", {wikis});
        }
    })
},

  new(req, res, next){
    const authorized = new Authorizer(req.user).new();
   
        if(authorized) {
          res.render("wikis/new");
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect("/wikis");
        }
      },

  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    
    if(authorized) {
    let newWiki = {
      title: req.body.title,
      body: req.body.body,
      userId: req.user.id,
      private: req.body.private,
      userId: req.user.id
    };
    wikiQueries.addWiki(newWiki, (err, wiki) => {
      if (err) {
        res.redirect(500, "/wikis/new");
      } else {
        res.redirect(303, `/wikis/${wiki.id}`);
      }
    });
  } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect("/wikis");
        }
      },

    show(req, res, next){ //works?
    wikiQueries.getWiki (req.params.id, (err, wiki) => { 
      if(err || wiki == null){ 
        res.redirect(404, "/"); 
      } else {
       console.log(wiki);
       wiki.body = markdown.toHTML(wiki.body);
        res.render("wikis/show", {wiki}); 
      }
    });
  },

 /*show(req, res, next){
  wikiQueries.getWiki (req.params.id, (err, result) => { 
    wiki = result['wiki'];
    wiki.collaborators = result["collaborators"]

    if(err || wiki == null){  
      res.redirect(404, "/"); 
    } else {
     console.log(wiki);
     wiki.body = markdown.toHTML(wiki.body);
      res.render("wikis/show", {wiki}); 
    }
  });
}, 

  /*show(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, result) => { // error
      wiki = result["wiki"];
      collaborators = result["collaborators"];

        if(err || wiki == null){
            res.redirect(404, "/");
        } else {
            const authorized = new Authorizer(req.user, wiki, collaborators).showCollaborators();
            
            if(authorized){
                wiki.body = markdown.toHTML(wiki.body);
                res.render("wikis/show", {wiki});
            } else {
                req.flash("notice", "You are not authorized to do that.");
                res.redirect(`/wikis`);
            }
        }
    });
  },*/

destroy(req, res, next){
 wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
   if(err){
     res.redirect(err, `/wikis/${wiki.id}`)
   } else {
     res.redirect(303, "/wikis")
   }
 });
},


edit(req, res, next){
  wikiQueries.getWiki(req.params.id, (err, wiki) => {
    if(err || wiki == null){
      res.redirect(404, "/");
    } else {

      const authorized = new Authorizer(req.user, wiki).edit();

    if(authorized){
       res.render("wikis/edit", {wiki});
      } else {
        req.flash("You are not authorized to do that.")
        res.redirect(`/wikis/${req.params.id}`)
      }
    }
   });
},

/* edit(req, res, next){
  wikiQueries.getWiki(req.params.id, (err, result) => {
    wiki = result["wiki"];
    collaborators = result["collaborators"];
      if(err || wiki == null){
          res.redirect(404, "/");
      } else {
        
      const authorized = new Authorizer(req.user, wiki, collaborators).edit();
      
      if(authorized){
          res.render("wikis/edit", {wiki, collaborators});
      } else {
      req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.id}`);
      }
        }
     });
  },
  */

 update(req, res, next) {
  wikiQueries.updateWiki(req, req.body, (err, wiki) => {

      if (err || wiki == null) {
          res.redirect(401, `/wikis/${req.params.id}/edit`);
      } else {
          res.redirect(`/wikis/${req.params.id}`);
      }
  });
},

private(req, res, next) {
  wikiQueries.getAllWikis((err, wikis) => {
      if(err){                
          res.redirect(500, "static/index");
      } else {
          res.render("wikis/private", {wikis});
      }
  })
},

}