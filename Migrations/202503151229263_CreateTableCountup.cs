namespace CountDown.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTableCountup : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Countups",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        StartDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Countups");
        }
    }
}
